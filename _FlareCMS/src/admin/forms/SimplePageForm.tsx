import { useState } from "react";
import { Box } from "@mui/material";

import {
  BoolCheck,
  EditorFormProps,
  LangCode,
  LanguageTabs,
  MarkdownEditor,
  SectionLabel,
  TextInput,
  readBoolean,
  readString,
  setModelValue,
  setSettingsValue,
} from "./fields";

/** `simple` template: about, contact, privacy, terms, eula. */
export function SimplePageForm({ model, onChange }: EditorFormProps) {
  const [lang, setLang] = useState<LangCode>("en");
  const language = model[lang];

  return (
    <Box>
      <LanguageTabs lang={lang} onChange={setLang} />
      <TextInput
        label="Title"
        value={readString(language, "title")}
        onChange={(value) => onChange(setModelValue(model, lang, "title", value))}
      />
      <MarkdownEditor
        label="Body"
        value={readString(language, "body")}
        onChange={(value) => onChange(setModelValue(model, lang, "body", value))}
      />
      <SectionLabel>Search engines</SectionLabel>
      <TextInput
        label="Meta title"
        value={readString(language, "metaTitle")}
        onChange={(value) => onChange(setModelValue(model, lang, "metaTitle", value))}
      />
      <TextInput
        label="Meta description"
        multiline
        minRows={2}
        value={readString(language, "metaDescription")}
        onChange={(value) => onChange(setModelValue(model, lang, "metaDescription", value))}
      />
      <SectionLabel>Page settings</SectionLabel>
      <BoolCheck
        label="Hide from search engines"
        checked={readBoolean(model.settings, "noIndex")}
        onChange={(checked) => onChange(setSettingsValue(model, "noIndex", checked))}
      />
    </Box>
  );
}
