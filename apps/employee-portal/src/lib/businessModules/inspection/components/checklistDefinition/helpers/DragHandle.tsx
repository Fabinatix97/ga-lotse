/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { DragIndicatorOutlined } from "@mui/icons-material";
import { Box } from "@mui/joy";

export function DragHandle(props: Readonly<DraggableProvidedDragHandleProps>) {
  return (
    <Box
      {...props}
      role="button"
      sx={{
        backgroundColor: (theme) => theme.palette.primary.softBg,
        borderRadius: "50%",
        padding: "0.25rem",
        width: "2rem",
        height: "2rem",
      }}
    >
      <DragIndicatorOutlined
        sx={{
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );
}
