import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import MediaPicker from "../MediaPicker";

export type LangCode = "en" | "lv";

export interface EditorModel {
  en: Record<string, unknown>;
  lv: Record<string, unknown>;
  settings: Record<string, unknown>;
}

/** Props shared by every template form component rendered by the editor. */
export interface EditorFormProps {
  model: EditorModel;
  onChange: (model: EditorModel) => void;
}

export function setModelValue(
  model: EditorModel,
  lang: LangCode,
  key: string,
  value: unknown
): EditorModel {
  return { ...model, [lang]: { ...model[lang], [key]: value } };
}

export function setSettingsValue(model: EditorModel, key: string, value: unknown): EditorModel {
  return { ...model, settings: { ...model.settings, [key]: value } };
}

// Runtime readers for fields that only exist on some template shapes.
function objectWithKey(obj: unknown, key: string): Record<string, unknown> | undefined {
  if (typeof obj !== "object" || obj === null) return undefined;
  if (!(key in obj)) return undefined;
  return obj as Record<string, unknown>; // `key in obj` verified above
}

export function readString(obj: unknown, key: string, fallback = ""): string {
  const value = objectWithKey(obj, key)?.[key];
  return typeof value === "string" ? value : fallback;
}

export function readBoolean(obj: unknown, key: string, fallback = false): boolean {
  const value = objectWithKey(obj, key)?.[key];
  return typeof value === "boolean" ? value : fallback;
}

export function readStringArray(obj: unknown, key: string): string[] {
  const value = objectWithKey(obj, key)?.[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function readObjectArray(obj: unknown, key: string): Record<string, unknown>[] {
  const value = objectWithKey(obj, key)?.[key];
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, unknown> =>
      typeof item === "object" && item !== null && !Array.isArray(item)
  );
}

export function langLabel(lang: LangCode): string {
  return lang === "en" ? "English" : "Latvian";
}

export function LanguageTabs({
  lang,
  onChange,
}: {
  lang: LangCode;
  onChange: (lang: LangCode) => void;
}) {
  return (
    <Tabs value={lang} onChange={(_event, next: LangCode) => onChange(next)}>
      <Tab label="English" value="en" />
      <Tab label="Latvian" value="lv" />
    </Tabs>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
      {children}
    </Typography>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  multiline = false,
  minRows = 1,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  minRows?: number;
  type?: string;
  placeholder?: string;
}) {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      size="small"
      margin="normal"
      autoComplete="off"
      multiline={multiline}
      minRows={multiline ? minRows : undefined}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function BoolCheck({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={(event) => onChange(event.target.checked)} />}
      label={label}
    />
  );
}

/** Markdown editor with a live preview, mirroring the previous editor UI. */
export function MarkdownEditor({
  label,
  value,
  onChange,
  rows = 16,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 1,
        }}
      >
        <TextField
          multiline
          fullWidth
          minRows={rows}
          placeholder="Write in Markdown..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          sx={{ fontFamily: "monospace", fontSize: "0.9em" }}
        />
        <Paper
          sx={{
            p: 2,
            minHeight: rows * 24 + 24,
            overflowY: "auto",
            maxHeight: rows * 24 + 24,
            backgroundColor: "#111111",
            borderColor: "divider",
            "& h1, & h2, & h3": { mt: 2, mb: 1 },
            "& p": { mb: 1 },
            "& a": { color: "primary.main" },
            "& pre": { backgroundColor: "#0a0a0a", p: 1, borderRadius: 1, overflowX: "auto" },
            "& code": {
              backgroundColor: "#0a0a0a",
              px: 0.5,
              borderRadius: 0.5,
              fontFamily: "monospace",
            },
            "& img": { maxWidth: "100%", borderRadius: 1 },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || "*Nothing to preview yet.*"}</ReactMarkdown>
        </Paper>
      </Box>
    </Box>
  );
}

/** Image field backed by the shared Media picker. */
export function ImageIdField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        {value ? (
          <Box
            component="img"
            src={`/api/assets/${value}`}
            alt=""
            sx={{ width: 96, height: 72, objectFit: "cover", borderRadius: 1, border: "1px solid", borderColor: "divider" }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No image selected
          </Typography>
        )}
        <Box>
          <Button variant="outlined" size="small" onClick={() => setPickerOpen(true)} sx={{ mr: 1 }}>
            {value ? "Change image" : "Choose image"}
          </Button>
          {value && (
            <Button variant="text" size="small" color="inherit" onClick={() => onChange(null)}>
              Clear
            </Button>
          )}
        </Box>
      </Box>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(id) => {
          onChange(id);
          setPickerOpen(false);
        }}
      />
    </Box>
  );
}
