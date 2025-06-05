/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import { Stack, Typography } from "@mui/joy";

import { multiLineEllipsis } from "@/lib/baseModule/theme/theme";

interface ChatDeviceIdProps {
  device: string;
  isEncryptionReady: boolean;
}

export function ChatDeviceId({ device, isEncryptionReady }: ChatDeviceIdProps) {
  return (
    <Stack spacing={1} sx={{ width: "100%" }}>
      <Typography level="body-sm" textColor="text.secondary">
        Device-ID
      </Typography>
      <Stack
        spacing={2}
        direction="row"
        sx={{ alignItems: "center" }}
        data-testid="matrix-device-id"
      >
        <Typography
          component="span"
          level="title-md"
          sx={{
            ...multiLineEllipsis(2),
            wordBreak: "break-all",
          }}
        >
          {device}
        </Typography>
        {isEncryptionReady && <GppGoodOutlinedIcon color="primary" />}
      </Stack>
    </Stack>
  );
}
