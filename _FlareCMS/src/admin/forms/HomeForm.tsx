import { useState } from "react";
import { Box } from "@mui/material";

import {
  EditorFormProps,
  ImageIdField,
  LangCode,
  LanguageTabs,
  SectionLabel,
  TextInput,
  readString,
  setModelValue,
  setSettingsValue,
} from "./fields";

const homeFields: Array<{ key: string; label: string; multiline?: boolean; rows?: number }> = [
  { key: "heroEyebrow", label: "Hero eyebrow" },
  { key: "heroTitle", label: "Hero title" },
  { key: "heroSubtitle", label: "Hero subtitle", multiline: true, rows: 3 },
  { key: "heroPrimaryLabel", label: "Primary button label" },
  { key: "heroSecondaryLabel", label: "Secondary button label" },
  { key: "eventsTitle", label: "Events heading" },
  { key: "eventsIntro", label: "Events introduction", multiline: true, rows: 3 },
  { key: "exploreEyebrow", label: "Explore eyebrow" },
  { key: "exploreTitle", label: "Explore title" },
  { key: "exploreIntro", label: "Explore introduction", multiline: true, rows: 3 },
];

/** `home` template: the public homepage. */
export function HomeForm({ model, onChange }: EditorFormProps) {
  const [lang, setLang] = useState<LangCode>("en");
  const language = model[lang];
  const heroImageId =
    typeof model.settings.heroImageId === "string" ? model.settings.heroImageId : null;

  return (
    <Box>
      <LanguageTabs lang={lang} onChange={setLang} />
      {homeFields.map((field) => (
        <TextInput
          key={field.key}
          label={field.label}
          multiline={field.multiline}
          minRows={field.rows}
          value={readString(language, field.key)}
          onChange={(value) => onChange(setModelValue(model, lang, field.key, value))}
        />
      ))}
      <SectionLabel>Page settings</SectionLabel>
      <ImageIdField
        label="Hero background image"
        value={heroImageId}
        onChange={(id) => onChange(setSettingsValue(model, "heroImageId", id))}
      />
      <TextInput
        label="Primary button URL"
        value={readString(model.settings, "heroPrimaryHref")}
        onChange={(value) => onChange(setSettingsValue(model, "heroPrimaryHref", value))}
      />
      <TextInput
        label="Secondary button URL"
        value={readString(model.settings, "heroSecondaryHref")}
        onChange={(value) => onChange(setSettingsValue(model, "heroSecondaryHref", value))}
      />
    </Box>
  );
}
