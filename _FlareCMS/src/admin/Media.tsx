import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Upload as UploadIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { ApiError, MediaRow, api, uploadMedia } from "./http";

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString();
}

const fileTypeHint = ".jpeg,.jpg,.png,.webp,.gif,.svg";

/** Upload button used by both the Media screen and the picker dialog. */
export function MediaUploadButton({ onUploaded }: { onUploaded: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      await uploadMedia(file);
      onUploaded();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/login");
        return;
      }
      setUploadError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Button
        variant="contained"
        startIcon={<UploadIcon />}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "Uploading…" : "Upload image"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={fileTypeHint}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      {uploadError && (
        <Typography variant="body2" color="error">
          {uploadError}
        </Typography>
      )}
    </Stack>
  );
}

/**
 * The media thumbnail grid. In select mode clicking a card hands its row to
 * `onPick`; otherwise each card offers alt-text editing and deletion.
 */
export function MediaGallery({
  selectable = false,
  onPick,
  refreshSignal = 0,
}: {
  selectable?: boolean;
  onPick?: (row: MediaRow) => void;
  refreshSignal?: number;
}) {
  const [rows, setRows] = useState<MediaRow[] | null>(null);
  const [error, setError] = useState("");
  const [altBusy, setAltBusy] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMedia = useCallback(() => {
    setError("");
    api<{ items: MediaRow[] }>("/api/assets")
      .then((body) => setRows(body.items))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          navigate("/login");
          return;
        }
        setError(err instanceof Error ? err.message : String(err));
      });
  }, [navigate]);

  useEffect(() => {
    setRows(null);
    fetchMedia();
  }, [fetchMedia, refreshSignal]);

  async function saveAlt(row: MediaRow, key: "altEn" | "altLv", value: string) {
    setAltBusy(row.id);
    try {
      const updated = await api<MediaRow>(`/api/assets/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ [key]: value }),
      });
      setRows((current) =>
        current ? current.map((item) => (item.id === row.id ? updated : item)) : current
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/login");
        return;
      }
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setAltBusy(null);
    }
  }

  async function handleDelete(row: MediaRow) {
    const confirmed = window.confirm(`Delete "${row.filename}"? The image will be removed everywhere it is used.`);
    if (!confirmed) return;
    try {
      await api<void>(`/api/assets/${row.id}`, { method: "DELETE" });
      await fetchMedia();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/login");
        return;
      }
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (error) {
    return (
      <Stack spacing={2} sx={{ py: 4, alignItems: "center" }}>
        <code>{error}</code>
        <Button variant="contained" onClick={fetchMedia}>
          Retry
        </Button>
      </Stack>
    );
  }

  if (rows === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
        No images yet — upload JPEG, PNG, WebP, GIF or SVG files (max 10 MB).
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(5, 1fr)",
        },
        gap: 1.5,
        py: 2,
      }}
    >
      {rows.map((row) => (
        <Card
          key={row.id}
          onClick={selectable && onPick ? () => onPick(row) : undefined}
          sx={{
            cursor: selectable ? "pointer" : "default",
            "&:hover": selectable ? { borderColor: "primary.main" } : undefined,
          }}
        >
          <Box
            component="img"
            src={`/api/assets/${row.id}`}
            alt={row.altEn || row.filename}
            loading="lazy"
            sx={{
              width: "100%",
              aspectRatio: "4 / 3",
              objectFit: "cover",
              display: "block",
              backgroundColor: "#000",
            }}
          />
          <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: 600,
              }}
              title={row.filename}
            >
              {row.filename}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatBytes(row.size)} · {formatDate(row.createdAt)}
            </Typography>
            {!selectable && (
              <Stack spacing={0.5} sx={{ mt: 1 }}>
                <TextField
                  size="small"
                  label="Alt (EN)"
                  defaultValue={row.altEn}
                  disabled={altBusy === row.id}
                  onBlur={(event) => {
                    if (event.target.value !== row.altEn) saveAlt(row, "altEn", event.target.value);
                  }}
                />
                <TextField
                  size="small"
                  label="Alt (LV)"
                  defaultValue={row.altLv}
                  disabled={altBusy === row.id}
                  onBlur={(event) => {
                    if (event.target.value !== row.altLv) saveAlt(row, "altLv", event.target.value);
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    size="small"
                    aria-label={`Delete ${row.filename}`}
                    onClick={() => handleDelete(row)}
                  >
                    <DeleteIcon color="error" fontSize="small" />
                  </IconButton>
                </Box>
              </Stack>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

function Media() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  return (
    <Container sx={{ py: 2 }}>
      <Stack direction="row" sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h4">Media</Typography>
        <MediaUploadButton onUploaded={() => setRefreshSignal((value) => value + 1)} />
      </Stack>
      <MediaGallery refreshSignal={refreshSignal} />
    </Container>
  );
}

export default Media;
