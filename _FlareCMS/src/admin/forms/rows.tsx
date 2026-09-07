import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

import {
  EditorModel,
  readBoolean,
  readObjectArray,
  readString,
} from "./fields";

/**
 * Repeatable editor for `navigation`/`footer` item rows. English and Latvian
 * arrays must keep the same length and order, so every row carries both
 * language labels plus the shared href/newTab values.
 */
export function NavRowsEditor({
  model,
  onChange,
}: {
  model: EditorModel;
  onChange: (model: EditorModel) => void;
}) {
  const enItems = readObjectArray(model.en, "items");
  const lvItems = readObjectArray(model.lv, "items");
  const length = Math.max(enItems.length, lvItems.length);

  function writeItems(enNext: Record<string, unknown>[], lvNext: Record<string, unknown>[]) {
    onChange({
      ...model,
      en: { ...model.en, items: enNext },
      lv: { ...model.lv, items: lvNext },
    });
  }

  function updateRow(
    index: number,
    values: { labelEn: string; labelLv: string; href: string; newTab: boolean }
  ) {
    const enNext = enItems.map((item, i) =>
      i === index ? { ...item, label: values.labelEn, href: values.href, newTab: values.newTab } : item
    );
    const lvNext = lvItems.map((item, i) =>
      i === index ? { ...item, label: values.labelLv, href: values.href, newTab: values.newTab } : item
    );
    writeItems(enNext, lvNext);
  }

  function removeRow(index: number) {
    writeItems(
      enItems.filter((_, i) => i !== index),
      lvItems.filter((_, i) => i !== index)
    );
  }

  function addRow() {
    writeItems(
      [...enItems, { label: "", href: "", newTab: false }],
      [...lvItems, { label: "", href: "", newTab: false }]
    );
  }

  return (
    <Box>
      {length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          No items yet.
        </Typography>
      )}
      {Array.from({ length }, (_, index) => {
        const enItem = enItems[index] ?? {};
        const lvItem = lvItems[index] ?? {};
        const labelEn = readString(enItem, "label");
        const labelLv = readString(lvItem, "label");
        const href = readString(enItem, "href") || readString(lvItem, "href");
        const newTab = readBoolean(enItem, "newTab") || readBoolean(lvItem, "newTab");
        return (
          <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "flex-start", mb: 1 }}>
            <TextField
              size="small"
              label="Label (EN)"
              value={labelEn}
              onChange={(event) =>
                updateRow(index, { labelEn: event.target.value, labelLv, href, newTab })
              }
            />
            <TextField
              size="small"
              label="Label (LV)"
              value={labelLv}
              onChange={(event) =>
                updateRow(index, { labelEn, labelLv: event.target.value, href, newTab })
              }
            />
            <TextField
              size="small"
              label="URL"
              value={href}
              onChange={(event) => updateRow(index, { labelEn, labelLv, href: event.target.value, newTab })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newTab}
                  onChange={(event) => updateRow(index, { labelEn, labelLv, href, newTab: event.target.checked })}
                />
              }
              label="New tab"
              sx={{ mt: 0.5, whiteSpace: "nowrap" }}
            />
            <IconButton size="small" aria-label="Remove item" onClick={() => removeRow(index)} sx={{ mt: 0.5 }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      })}
      <Button startIcon={<AddIcon />} onClick={addRow} sx={{ mt: 0.5 }}>
        Add item
      </Button>
    </Box>
  );
}

/** Simple repeatable list of short strings (e.g. donation features). */
export function StringListEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <Box>
      {values.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          No entries yet.
        </Typography>
      )}
      {values.map((value, index) => (
        <Stack direction="row" spacing={1} key={index} sx={{ mb: 1 }}>
          <TextField
            size="small"
            fullWidth
            label={`${label} ${index + 1}`}
            value={value}
            onChange={(event) => {
              const next = values.slice();
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <IconButton
            aria-label="Remove entry"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Button startIcon={<AddIcon />} onClick={() => onChange([...values, ""])}>
        Add {label}
      </Button>
    </Box>
  );
}
