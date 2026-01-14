/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Divider } from "@mui/joy";

export function HistoryDetailsDivider({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return null;
  }

  return (
    <Divider orientation="vertical" sx={{ marginY: 1 }}>
      <ArrowUpwardIcon size="lg" />
    </Divider>
  );
}
