/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ErrorOutlineOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";

interface InspectionDuplicateTileProps {
  text: string;
  importedText: string;
}

export function LineWithPossibleExclamationMark({
  text,
  importedText,
}: Readonly<InspectionDuplicateTileProps>) {
  return (
    <Stack direction="row" gap={0.5}>
      {text !== importedText && (
        <ErrorOutlineOutlined
          sx={{ height: 16, marginTop: 0.4, color: "#9A5B13" }}
        />
      )}
      <Typography>{text}</Typography>
    </Stack>
  );
}
