import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { SiteRecord, emptyLanguage, emptySettings } from "../contentTypes";
import { templateForms } from "./forms";
import type { EditorModel } from "./forms/fields";
import { ApiError, api } from "./http";

const FIXED_LABELS: Record<string, string> = {
  home: "Homepage",
  about: "About",
  history: "History",
  community: "Community",
  membership: "Membership",
  culture: "Culture & Traditions",
  contact: "Contact",
  donate: "Donate",
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
  eula: "EULA",
  navigation: "Header navigation",
  footer: "Footer",
  site: "Site details",
};

function mergeDefaults(
  empty: Record<string, unknown>,
  stored: unknown
): Record<string, unknown> {
  if (typeof stored === "object" && stored !== null && !Array.isArray(stored)) {
    return { ...empty, ...(stored as Record<string, unknown>) }; // stored is the parsed JSON record
  }
  return { ...empty };
}

function englishTitle(record: SiteRecord): string {
  const content = record.contentEn;
  if (typeof content === "object" && content !== null && "title" in content) {
    const title = (content as Record<string, unknown>).title;
    if (typeof title === "string" && title.trim()) return title;
  }
  return "";
}

function recordLabel(record: SiteRecord): string {
  if (record.slug && FIXED_LABELS[record.slug]) return FIXED_LABELS[record.slug];
  return englishTitle(record) || record.slug || `Record ${record.rowid}`;
}

/** English public URL for a record, or null when it has no public page. */
function publicUrl(record: SiteRecord): string | null {
  if (!record.slug) return null;
  if (record.template === "event") return `/en/events/${record.slug}`;
  if (record.slug === "home") return "/en";
  if (record.slug === "donate") return "/en/donate";
  if (record.template === "navigation" || record.template === "footer" || record.template === "site") {
    return null;
  }
  return `/en/${record.slug}`;
}

export function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<SiteRecord | null>(null);
  const [model, setModel] = useState<EditorModel | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const loadRecord = useCallback(() => {
    if (!id || id === "new") return;
    setRecord(null);
    setLoadError("");
    api<SiteRecord>(`/api/posts/${id}`)
      .then((fetched) => {
        const template = fetched.template;
        setRecord(fetched);
        setModel({
          en: mergeDefaults(emptyLanguage(template, "en"), fetched.contentEn),
          lv: mergeDefaults(emptyLanguage(template, "lv"), fetched.contentLv),
          settings: mergeDefaults(emptySettings(template), fetched.settings),
        });
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          navigate("/login");
          return;
        }
        setLoadError(err instanceof Error ? err.message : String(err));
      });
  }, [id, navigate]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 3000);
    return () => window.clearTimeout(timer);
  }, [saved]);

  async function handleSave() {
    if (!record || !model || saving) return;
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      const updated = await api<SiteRecord>(`/api/posts/${record.rowid}`, {
        method: "PATCH",
        body: JSON.stringify({
          contentEn: model.en,
          contentLv: model.lv,
          settings: model.settings,
        }),
      });
      setRecord(updated);
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/login");
        return;
      }
      setSaveError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return (
      <Container sx={{ py: 2 }}>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <code>{loadError}</code>
          <Button variant="contained" onClick={loadRecord}>
            Retry
          </Button>
        </Stack>
      </Container>
    );
  }

  if (!record || !model) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const Form = templateForms[record.template];
  const url = publicUrl(record);

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column" }}>
      <Toolbar variant="dense" disableGutters sx={{ px: 2, gap: 1 }}>
        <IconButton
          size="large"
          color="inherit"
          component={RouterLink}
          to="/admin/pages"
          aria-label="Back to pages"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {recordLabel(record)}
        </Typography>
        {url && (
          <Button
            variant="outlined"
            size="small"
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<OpenInNewIcon />}
          >
            View page
          </Button>
        )}
        {saved && (
          <Typography variant="body2" color="success.main">
            Saved
          </Typography>
        )}
        <Button variant="contained" size="small" disabled={saving} onClick={handleSave}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </Toolbar>
      <Container sx={{ overflowY: "auto", flexGrow: 1, pb: 4 }}>
        {saveError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {saveError}
          </Typography>
        )}
        <Form model={model} onChange={setModel} />
      </Container>
    </div>
  );
}
