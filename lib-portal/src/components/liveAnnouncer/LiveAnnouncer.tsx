/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box } from "@mui/joy";

export function LiveAnnouncer({
  message,
  active,
}: {
  message: string;
  active: boolean;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        width: "1px",
        height: "1px",
        top: "-1px",
        clip: "rect(1px, 1px, 1px, 1px)",
        overflow: "hidden",
      }}
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      {active && message}
    </Box>
  );
}
