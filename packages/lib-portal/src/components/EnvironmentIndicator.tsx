/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { WarningAmberOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/joy";

import { useIsDevEnvironment } from "./EnvironmentTypeProvider";

export function useEnvironmentIndicatorHeight(): string {
  const isDevEnvironment = useIsDevEnvironment();
  return isDevEnvironment ? "2.5rem" : "0px";
}

export function EnvironmentIndicator() {
  const isDevEnvironment = useIsDevEnvironment();
  const environmentIndicatorHeight = useEnvironmentIndicatorHeight();

  if (!isDevEnvironment) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        height: environmentIndicatorHeight,
        backgroundColor: "warning.100",
      }}
    >
      <WarningAmberOutlined />
      <Typography level="title-md" fontWeight="600" textTransform="uppercase">
        Testumgebung
      </Typography>
    </Box>
  );
}
