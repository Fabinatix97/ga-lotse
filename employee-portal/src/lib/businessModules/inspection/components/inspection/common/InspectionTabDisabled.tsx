/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InfoOutlined } from "@mui/icons-material";
import { Sheet, Stack, SvgIcon, Typography } from "@mui/joy";

export function InspectionTabDisabled({
  message,
  margin,
}: Readonly<{
  message: string;
  margin: number;
}>) {
  return (
    <Sheet
      sx={{
        padding: 12,
        backgroundColor: "background.body",
        borderRadius: "lg",
        alignItems: "center",
        margin: { margin },
      }}
    >
      <Stack spacing={2} sx={{ alignItems: "center", marginBottom: 50 }}>
        <SvgIcon sx={{ width: "40px", height: "40px" }}>
          <InfoOutlined />
        </SvgIcon>
        <Typography textAlign="center" data-testid="message">
          {message}
        </Typography>
      </Stack>
    </Sheet>
  );
}
