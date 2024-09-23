/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DoneIcon from "@mui/icons-material/Done";
import { Box, useTheme } from "@mui/joy";

interface ReceiptStatusProps {
  unreadNotifications?: number;
}

export function ReceiptStatus({ unreadNotifications }: ReceiptStatusProps) {
  const theme = useTheme();

  if (!!unreadNotifications) {
    return (
      <Box
        component="span"
        sx={{
          display: "grid",
          placeItems: "center",
          width: "1.25rem",
          height: "1.25rem",
          backgroundColor: "danger.400",
          color: "white",
          borderRadius: "100%",
          fontSize: theme.fontSize.xs,
          fontWeight: "500",
        }}
      >
        {unreadNotifications}
      </Box>
    );
  }

  return (
    <DoneIcon
      color="primary"
      sx={{ color: theme.palette.neutral.outlinedDisabledColor }}
    />
  );
}
