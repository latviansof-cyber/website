import React, { useState } from "react";
import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

import {
  BoolCheck,
  EditorFormProps,
  LangCode,
  LanguageTabs,
  SectionLabel,
  TextInput,
  readBoolean,
  readObjectArray,
  readString,
  readStringArray,
  setModelValue,
} from "./fields";
import { StringListEditor } from "./rows";

function TextInputCell({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <TextField
      label={label}
      size="small"
      multiline={multiline}
      minRows={multiline ? 2 : undefined}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      sx={{ flex: multiline ? "1 1 100%" : undefined, minWidth: 160 }}
    />
  );
}

function CardBlock({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap", alignItems: "center" }}>
      {children}
    </Stack>
  );
}

/** `donate` template: donation instructions and payment options per language. */
export function DonateForm({ model, onChange }: EditorFormProps) {
  const [lang, setLang] = useState<LangCode>("en");
  const language = model[lang];

  const features = readStringArray(language, "features");
  const priorityCards = readObjectArray(language, "priorityCards");
  const donationCards = readObjectArray(language, "donationCards");

  function patchLanguage(patch: Record<string, unknown>) {
    onChange({
      ...model,
      [lang]: { ...language, ...patch },
    });
  }

  function replaceArray(
    key: "features" | "priorityCards" | "donationCards",
    next: unknown[]
  ) {
    patchLanguage({ [key]: next });
  }

  return (
    <Box>
      <LanguageTabs lang={lang} onChange={setLang} />
      <TextInput
        label="Page title"
        value={readString(language, "title")}
        onChange={(value) => onChange(setModelValue(model, lang, "title", value))}
      />
      <TextInput
        label="Introduction"
        multiline
        minRows={3}
        value={readString(language, "introduction")}
        onChange={(value) => onChange(setModelValue(model, lang, "introduction", value))}
      />
      <SectionLabel>Bank transfer details</SectionLabel>
      <TextInput
        label="Bank name"
        value={readString(language, "bankName")}
        onChange={(value) => onChange(setModelValue(model, lang, "bankName", value))}
      />
      <TextInput
        label="BSB"
        value={readString(language, "bsb")}
        onChange={(value) => onChange(setModelValue(model, lang, "bsb", value))}
      />
      <TextInput
        label="Account number"
        value={readString(language, "accountNumber")}
        onChange={(value) => onChange(setModelValue(model, lang, "accountNumber", value))}
      />
      <TextInput
        label="Account name"
        value={readString(language, "accountName")}
        onChange={(value) => onChange(setModelValue(model, lang, "accountName", value))}
      />
      <TextInput
        label="PayID email"
        value={readString(language, "payId")}
        onChange={(value) => onChange(setModelValue(model, lang, "payId", value))}
      />
      <TextInput
        label="Instructions"
        multiline
        minRows={3}
        value={readString(language, "instructions")}
        onChange={(value) => onChange(setModelValue(model, lang, "instructions", value))}
      />

      <SectionLabel>Features (ticked benefits above the cards)</SectionLabel>
      <StringListEditor
        label="feature"
        values={features}
        onChange={(next) => replaceArray("features", next)}
      />

      <SectionLabel>Priority cards</SectionLabel>
      {priorityCards.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          No priority cards yet.
        </Typography>
      )}
      {priorityCards.map((card, index) => (
        <CardBlock key={index}>
          <TextInputCell
            label="Title"
            value={readString(card, "title")}
            onChange={(value) => {
              const next = priorityCards.slice();
              next[index] = { ...card, title: value };
              replaceArray("priorityCards", next);
            }}
          />
          <TextInputCell
            label="Description"
            multiline
            value={readString(card, "body")}
            onChange={(value) => {
              const next = priorityCards.slice();
              next[index] = { ...card, body: value };
              replaceArray("priorityCards", next);
            }}
          />
          <TextInputCell
            label="Link URL"
            value={readString(card, "url")}
            onChange={(value) => {
              const next = priorityCards.slice();
              next[index] = { ...card, url: value };
              replaceArray("priorityCards", next);
            }}
          />
          <BoolCheck
            label="New tab"
            checked={readBoolean(card, "newTab")}
            onChange={(value) => {
              const next = priorityCards.slice();
              next[index] = { ...card, newTab: value };
              replaceArray("priorityCards", next);
            }}
          />
          <IconButton
            aria-label="Remove priority card"
            onClick={() => replaceArray("priorityCards", priorityCards.filter((_, i) => i !== index))}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardBlock>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          replaceArray("priorityCards", [
            ...priorityCards,
            { title: "", body: "", url: "", newTab: false },
          ])
        }
      >
        Add priority card
      </Button>

      <SectionLabel>Donation option cards</SectionLabel>
      {donationCards.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          No donation cards yet.
        </Typography>
      )}
      {donationCards.map((card, index) => {
        const rawAmount = card.amount;
        const amountValue =
          typeof rawAmount === "number" && !Number.isNaN(rawAmount)
            ? String(rawAmount)
            : typeof rawAmount === "string"
            ? rawAmount
            : "";
        return (
          <CardBlock key={index}>
          <TextField
            label="Amount (AUD)"
            type="number"
            size="small"
            value={amountValue}
            onChange={(event) => {
              const next = donationCards.slice();
              next[index] = { ...card, amount: Number(event.target.value) };
              replaceArray("donationCards", next);
            }}
            sx={{ width: 150 }}
          />
          <TextInputCell
            label="Description"
            multiline
            value={readString(card, "body")}
            onChange={(value) => {
              const next = donationCards.slice();
              next[index] = { ...card, body: value };
              replaceArray("donationCards", next);
            }}
          />
          <TextInputCell
            label="Link URL"
            value={readString(card, "url")}
            onChange={(value) => {
              const next = donationCards.slice();
              next[index] = { ...card, url: value };
              replaceArray("donationCards", next);
            }}
          />
          <BoolCheck
            label="New tab"
            checked={readBoolean(card, "newTab")}
            onChange={(value) => {
              const next = donationCards.slice();
              next[index] = { ...card, newTab: value };
              replaceArray("donationCards", next);
            }}
          />
          <IconButton
            aria-label="Remove donation card"
            onClick={() => replaceArray("donationCards", donationCards.filter((_, i) => i !== index))}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardBlock>
        );
      })}
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          replaceArray("donationCards", [
            ...donationCards,
            { amount: 0, body: "", url: "", newTab: true },
          ])
        }
      >
        Add donation card
      </Button>
    </Box>
  );
}
