import { useState } from "react";
import { Box } from "@mui/material";

import {
  EditorFormProps,
  LangCode,
  LanguageTabs,
  SectionLabel,
  TextInput,
  readString,
  setModelValue,
} from "./fields";
import { NavRowsEditor } from "./rows";

/** `footer` template: tagline/address/rights per language plus shared link rows. */
export function FooterForm({ model, onChange }: EditorFormProps) {
  const [lang, setLang] = useState<LangCode>("en");
  const language = model[lang];

  return (
    <Box>
      <LanguageTabs lang={lang} onChange={setLang} />
      <TextInput
        label="Tagline"
        value={readString(language, "tagline")}
        onChange={(value) => onChange(setModelValue(model, lang, "tagline", value))}
      />
      <TextInput
        label="Address"
        value={readString(language, "address")}
        onChange={(value) => onChange(setModelValue(model, lang, "address", value))}
      />
      <TextInput
        label="Rights text (copyright notice)"
        value={readString(language, "rights")}
        onChange={(value) => onChange(setModelValue(model, lang, "rights", value))}
      />
      <SectionLabel>Footer links</SectionLabel>
      <NavRowsEditor model={model} onChange={onChange} />
    </Box>
  );
}
