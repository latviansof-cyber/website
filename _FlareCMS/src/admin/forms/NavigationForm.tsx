import { Box, Typography } from "@mui/material";

import { EditorFormProps } from "./fields";
import { NavRowsEditor } from "./rows";

/** `navigation` template: header navigation. Rows pair English and Latvian labels. */
export function NavigationForm({ model, onChange }: EditorFormProps) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
        Header navigation items
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Each row provides the English and Latvian label for one link. Order shown is the order in the header.
      </Typography>
      <NavRowsEditor model={model} onChange={onChange} />
    </Box>
  );
}
