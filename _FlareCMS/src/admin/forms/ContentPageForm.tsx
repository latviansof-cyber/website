import { useState } from "react";
import { Box } from "@mui/material";

import {
  BoolCheck,
  EditorFormProps,
  ImageIdField,
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

/** `content` template: history, community, membership, culture. */
export function ContentPageForm({ model, onChange }: EditorFormProps) {
  const [lang, setLang] = useState<LangCode>("en");
  const language = model[lang];
  const imageId =
    typeof model.settings.imageId === "string" ? model.settings.imageId : null;

  return (
    <Box>
      <LanguageTabs lang={lang} onChange={setLang} />
      <TextInput
        label="Title"
        value={readString(language, "title")}
        onChange={(value) => onChange(setModelValue(model, lang, "title", value))}
      />
      <TextInput
        label="Excerpt (short summary for cards)"
        multiline
        minRows={2}
        value={readString(language, "excerpt")}
        onChange={(value) => onChange(setModelValue(model, lang, "excerpt", value))}
      />
      <MarkdownEditor
        label="Body"
        value={readString(language, "body")}
        onChange={(value) => onChange(setModelValue(model, lang, "body", value))}
      />
      <SectionLabel>Call to action</SectionLabel>
      <TextInput
        label="Button label"
        value={readString(language, "ctaLabel")}
        onChange={(value) => onChange(setModelValue(model, lang, "ctaLabel", value))}
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
      <ImageIdField
        label="Card image"
        value={imageId}
        onChange={(id) => onChange(setSettingsValue(model, "imageId", id))}
      />
      <TextInput
        label="Call to action URL"
        value={readString(model.settings, "ctaHref")}
        onChange={(value) => onChange(setSettingsValue(model, "ctaHref", value))}
      />
      <BoolCheck
        label="Hide from search engines"
        checked={readBoolean(model.settings, "noIndex")}
        onChange={(checked) => onChange(setSettingsValue(model, "noIndex", checked))}
      />
    </Box>
  );
}
