import { useState } from "react";
import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

import {
  EditorFormProps,
  LangCode,
  LanguageTabs,
  SectionLabel,
  TextInput,
  readObjectArray,
  readString,
  setModelValue,
  setSettingsValue,
} from "./fields";

/** `site` template: association name/tagline/contact email per language plus social links. */
export function SiteForm({ model, onChange }: EditorFormProps) {
  const [lang, setLang] = useState<LangCode>("en");
  const language = model[lang];
  const socialLinks = readObjectArray(model.settings, "socialLinks");

  function updateLink(index: number, key: string, value: string) {
    const next = socialLinks.map((link, i) => (i === index ? { ...link, [key]: value } : link));
    onChange(setSettingsValue(model, "socialLinks", next));
  }

  return (
    <Box>
      <LanguageTabs lang={lang} onChange={setLang} />
      <TextInput
        label="Association name"
        value={readString(language, "associationName")}
        onChange={(value) => onChange(setModelValue(model, lang, "associationName", value))}
      />
      <TextInput
        label="Tagline"
        value={readString(language, "tagline")}
        onChange={(value) => onChange(setModelValue(model, lang, "tagline", value))}
      />
      <TextInput
        label="Contact email"
        value={readString(language, "contactEmail")}
        onChange={(value) => onChange(setModelValue(model, lang, "contactEmail", value))}
      />
      <SectionLabel>Social media links</SectionLabel>
      {socialLinks.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          No links yet.
        </Typography>
      )}
      {socialLinks.map((link, index) => (
        <Stack direction="row" spacing={1} key={index} sx={{ mb: 1 }}>
          <TextField
            size="small"
            label="Platform"
            value={readString(link, "platform")}
            onChange={(event) => updateLink(index, "platform", event.target.value)}
          />
          <TextField
            size="small"
            label="Full URL"
            value={readString(link, "url")}
            onChange={(event) => updateLink(index, "url", event.target.value)}
          />
          <IconButton
            aria-label="Remove social link"
            onClick={() =>
              onChange(
                setSettingsValue(
                  model,
                  "socialLinks",
                  socialLinks.filter((_, i) => i !== index)
                )
              )
            }
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          onChange(setSettingsValue(model, "socialLinks", [...socialLinks, { platform: "", url: "" }]))
        }
      >
        Add social link
      </Button>
    </Box>
  );
}
