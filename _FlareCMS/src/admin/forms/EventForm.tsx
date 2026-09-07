import { useState } from "react";
import { Box, MenuItem, TextField as MuiTextField } from "@mui/material";

import {
  EditorFormProps,
  ImageIdField,
  LangCode,
  LanguageTabs,
  MarkdownEditor,
  SectionLabel,
  TextInput,
  readString,
  setModelValue,
  setSettingsValue,
} from "./fields";
import { AccentTone } from "../../contentTypes";

const accentTones: AccentTone[] = ["emerald", "amber", "sky", "rose", "violet", "slate"];

/** Converts an ISO value to the format accepted by <input type="datetime-local">. */
function toLocalInput(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 16);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

/** `event` template: an event page under /:lang/events/:slug. */
export function EventForm({ model, onChange }: EditorFormProps) {
  const [lang, setLang] = useState<LangCode>("en");
  const language = model[lang];
  const accentTone = readString(model.settings, "accentTone", "rose");
  const imageId = typeof model.settings.imageId === "string" ? model.settings.imageId : null;

  return (
    <Box>
      <LanguageTabs lang={lang} onChange={setLang} />
      <TextInput
        label="Title"
        value={readString(language, "title")}
        onChange={(value) => onChange(setModelValue(model, lang, "title", value))}
      />
      <MarkdownEditor
        label="Description"
        value={readString(language, "body")}
        onChange={(value) => onChange(setModelValue(model, lang, "body", value))}
      />
      <SectionLabel>Event settings</SectionLabel>
      <TextInput
        label="Date and time"
        type="datetime-local"
        value={toLocalInput(readString(model.settings, "eventDate"))}
        placeholder="YYYY-MM-DDTHH:mm"
        onChange={(value) => {
          const iso = value ? new Date(value).toISOString() : "";
          onChange(setSettingsValue(model, "eventDate", iso));
        }}
      />
      <MuiTextField
        select
        label="Accent colour"
        size="small"
        fullWidth
        margin="normal"
        value={accentTone}
        onChange={(event) =>
          onChange(setSettingsValue(model, "accentTone", event.target.value as AccentTone))
        }
      >
        {accentTones.map((tone) => (
          <MenuItem key={tone} value={tone}>
            {tone.charAt(0).toUpperCase() + tone.slice(1)}
          </MenuItem>
        ))}
      </MuiTextField>
      <TextInput
        label="Facebook event URL"
        value={readString(model.settings, "facebookUrl")}
        onChange={(value) => onChange(setSettingsValue(model, "facebookUrl", value))}
      />
      <ImageIdField
        label="Event image"
        value={imageId}
        onChange={(id) => onChange(setSettingsValue(model, "imageId", id))}
      />
    </Box>
  );
}
