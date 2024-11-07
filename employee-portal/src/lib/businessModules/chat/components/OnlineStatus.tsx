/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack, Typography } from "@mui/joy";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { getStatusColor } from "@/lib/businessModules/chat/shared/utils";

interface OnlineStatusProps {
  userId: string;
  name?: string;
}

export function OnlineStatus({ userId, name }: OnlineStatusProps) {
  const { usersPresence } = useChatClientContext();
  const presence = usersPresence[userId];

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
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
      <Typography noWrap>{name ?? presence}</Typography>
    </Stack>
  );
}
