/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack, Typography } from "@mui/joy";

import { Presence } from "@/lib/businessModules/chat/shared/types";
import { getStatusColor } from "@/lib/businessModules/chat/shared/utils";

interface OnlineStatusProps {
  name?: string;
  presence?: Presence;
}

export function OnlineStatus({ name, presence }: OnlineStatusProps) {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ alignItems: "center", overflow: "hidden" }}
    >
      {presence && (
        <Box
          sx={{
            width: "0.75rem",
            height: "0.75rem",
            borderRadius: "100%",
            border: "2px solid white",
            backgroundColor: getStatusColor(presence),
            flexShrink: 0,
          }}
        />
      )}
      <Typography
        noWrap
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {name ?? presence}
      </Typography>
    </Stack>
  );
}
