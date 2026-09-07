import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { SiteRecord } from "../contentTypes";
import { ApiError, api } from "./http";

// Admin labels for the fixed records, in the order defined for the evaluation.
const PAGE_ORDER = [
  "home",
  "about",
  "history",
  "community",
  "membership",
  "culture",
  "contact",
  "donate",
  "privacy",
  "terms",
  "eula",
] as const;

const PAGE_LABELS: Record<string, string> = {
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

// Runtime readers for fields that only exist on some template shapes.
function readString(obj: unknown, key: string): string | undefined {
  if (typeof obj !== "object" || obj === null) return undefined;
  if (!(key in obj)) return undefined;
  const value = (obj as Record<string, unknown>)[key]; // key verified present above
  return typeof value === "string" ? value : undefined;
}

function englishTitle(record: SiteRecord): string {
  const title = readString(record.contentEn, "title");
  return title && title.trim() ? title : "(Untitled)";
}

function recordLabel(record: SiteRecord): string {
  if (record.slug && PAGE_LABELS[record.slug]) return PAGE_LABELS[record.slug];
  return englishTitle(record);
}

function eventDate(record: SiteRecord): string {
  return readString(record.settings, "eventDate") ?? "";
}

function Posts() {
  const [records, setRecords] = useState<SiteRecord[] | null>(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchPages = useCallback(() => {
    setError("");
    setRecords(null);
    api<{ items: SiteRecord[] }>("/api/posts?type=page")
      .then((body) => setRecords(body.items))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          navigate("/login");
          return;
        }
        setError(err instanceof Error ? err.message : String(err));
      });
  }, [navigate]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  async function handleAddEvent() {
    setCreating(true);
    try {
      const body = await api<{ rowid: number }>("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          template: "event",
          contentEn: { title: "New event", body: "" },
          contentLv: { title: "Jauns pasākums", body: "" },
          settings: {
            eventDate: "",
            facebookUrl: "",
            imageId: null,
            accentTone: "rose",
          },
        }),
      });
      navigate(`/admin/pages/${body.rowid}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/login");
        return;
      }
      setError(err instanceof Error ? err.message : String(err));
      setCreating(false);
    }
  }

  async function handleDeleteEvent(record: SiteRecord) {
    const confirmed = window.confirm(
      `Delete the event "${englishTitle(record)}"? This cannot be undone.`
    );
    if (!confirmed) return;
    setDeletingId(record.rowid);
    try {
      await api<void>(`/api/posts/${record.rowid}`, { method: "DELETE" });
      await fetchPages();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/login");
        return;
      }
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setDeletingId(null);
    }
  }

  if (error) {
    return (
      <Container sx={{ py: 2 }}>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <code>{error}</code>
          <Button variant="contained" onClick={fetchPages}>
            Retry
          </Button>
        </Stack>
      </Container>
    );
  }

  if (records === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const websitePages = PAGE_ORDER.map((slug) =>
    records.find((record) => record.slug === slug)
  ).filter((record): record is SiteRecord => Boolean(record));

  const sharedContent = ["navigation", "footer", "site"]
    .map((slug) => records.find((record) => record.slug === slug))
    .filter((record): record is SiteRecord => Boolean(record));

  const events = records
    .filter((record) => record.template === "event")
    .sort((a, b) => {
      const ad = eventDate(a) || "\uffff";
      const bd = eventDate(b) || "\uffff";
      return ad < bd ? -1 : ad > bd ? 1 : 0;
    });

  function renderRow(record: SiteRecord, deletable: boolean) {
    return (
      <Card key={record.rowid} sx={{ my: 1 }}>
        <CardContent
          sx={{
            py: 1.5,
            "&:last-child": { pb: 1.5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flexGrow: 1,
            }}
          >
            {recordLabel(record)}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon />}
              component="a"
              href={`/admin/pages/${record.rowid}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/admin/pages/${record.rowid}`);
              }}
            >
              Edit
            </Button>
            {deletable && (
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                disabled={deletingId === record.rowid}
                onClick={() => handleDeleteEvent(record)}
              >
                Delete
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Pages
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Website pages
      </Typography>
      {websitePages.map((record) => renderRow(record, false))}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Shared website content
      </Typography>
      {sharedContent.map((record) => renderRow(record, false))}
      <Stack direction="row" sx={{ mt: 3, alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6">Events</Typography>
        <Button variant="contained" startIcon={<EditIcon />} disabled={creating} onClick={handleAddEvent}>
          Add Event
        </Button>
      </Stack>
      {events.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          No events yet — use Add Event to create one.
        </Typography>
      ) : (
        events.map((record) => renderRow(record, true))
      )}
    </Container>
  );
}

export default Posts;
