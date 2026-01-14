/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Sheet, Stack, Typography } from "@mui/joy";

interface DeletedMessageProps {
  isSent: boolean;
}

export function DeletedMessage({ isSent }: Readonly<DeletedMessageProps>) {
  return (
    <Sheet
      color={isSent ? "primary" : "neutral"}
      variant={isSent ? "solid" : "soft"}
      sx={{
        p: 1,
        borderRadius: "md",
        backgroundColor: isSent ? "primary.500" : "neutral.100",
        marginLeft: 1,
        marginRight: 1,
      }}
    >
      <Stack direction="row">
        <DeleteOutlineIcon
          sx={{
            color: isSent ? "background.body" : "text.primary",
            opacity: 0.5,
          }}
        />
        <Typography
          component="div"
          level="body-md"
          sx={{
            color: isSent ? "background.body" : "text.primary",
            paddingLeft: 0.3,
            paddingRight: 0.5,
            opacity: 0.5,
          }}
        >
          Nachricht gelöscht
        </Typography>
      </Stack>
    </Sheet>
  );
}
