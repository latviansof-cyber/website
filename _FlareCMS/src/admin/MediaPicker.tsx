import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";

import { MediaGallery, MediaUploadButton } from "./Media";

/** Material UI dialog that returns the id of the media row the user picks. */
function MediaPicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (id: string) => void;
}) {
  const [refreshSignal, setRefreshSignal] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Choose an image</DialogTitle>
      <DialogContent>
        <Stack direction="row" sx={{ mb: 1, alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Click an image to use it in the page.
          </Typography>
          <MediaUploadButton onUploaded={() => setRefreshSignal((value) => value + 1)} />
        </Stack>
        <MediaGallery
          selectable
          refreshSignal={refreshSignal}
          onPick={(row) => onPick(row.id)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default MediaPicker;
