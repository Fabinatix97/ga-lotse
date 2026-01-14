/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { WifiOffOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/joy";

import { useIsMobile } from "@eshg/lib-portal";

import { useIsOffline } from "../hooks/useIsOffline";

export function useOfflineIndicatorHeight(): string {
  const isOffline = useIsOffline();
  return isOffline ? "2.5rem" : "0px";
}

export function OfflineIndicator() {
  const isOffline = useIsOffline();
  const isMobile = useIsMobile();
  const offlineIndicatorHeight = useOfflineIndicatorHeight();

  if (!isOffline) {
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
        height: offlineIndicatorHeight,
        backgroundColor: "danger.400",
      }}
    >
      <WifiOffOutlined />
      <Typography level="title-md" fontWeight="600">
        {!isMobile && "Verbindung unterbrochen – "}Anwendung offline
      </Typography>
    </Box>
  );
}
