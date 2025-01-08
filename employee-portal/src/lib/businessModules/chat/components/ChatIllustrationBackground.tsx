/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";

import { NewChatIllustration } from "@/lib/businessModules/chat/assets/NewChatIllustration";

export function ChatIllustrationBackground() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100% - 24px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      <NewChatIllustration
        sx={{ width: "100%", height: "100%", maxWidth: "27.5rem" }}
      />
    </Box>
  );
}
