/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ContentCopyOutlined } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/joy";

import { multiLineEllipsis } from "@/lib/baseModule/theme/theme";
import { useCopy } from "@/lib/shared/hooks/useCopy";

interface ChatUserIdProps {
  userId?: string | null;
  noLabel?: boolean;
}

export function ChatUserId({ userId, noLabel = false }: ChatUserIdProps) {
  const copy = useCopy();

  if (!userId) return null;

  return (
    <Stack spacing={1} sx={{ width: "100%" }}>
      {!noLabel && (
        <Typography level="body-sm" textColor="text.secondary">
          Chat-ID
        </Typography>
      )}
      <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
        <Typography
          level="title-md"
          sx={{
            ...multiLineEllipsis(2),
            wordBreak: "break-all",
          }}
        >
          {userId}
        </Typography>
        <IconButton
          aria-label="Copy chat id"
          variant="outlined"
          color="primary"
          onClick={async () => await copy(userId)}
        >
          <ContentCopyOutlined size="sm" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
