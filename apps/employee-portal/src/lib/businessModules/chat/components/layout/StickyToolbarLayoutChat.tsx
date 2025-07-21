/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box } from "@mui/joy";
import { ReactNode } from "react";

import { useHeaderHeights } from "@eshg/lib-employee-portal";

interface StickyToolbarLayoutProps {
  children: ReactNode;
  toolbar: ReactNode;
}

export function StickyToolbarLayoutChat(props: StickyToolbarLayoutProps) {
  const { headerHeightMobile, headerHeightDesktop } = useHeaderHeights();
  return (
    <>
      <Box
        sx={{
          position: "sticky",
          zIndex: (theme) => theme.zIndex.toolbar,
          top: {
            xxs: headerHeightMobile,
            sm: headerHeightDesktop,
          },
          display: { xxs: "none", sm: "block" },
        }}
      >
        {props.toolbar}
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {props.children}
      </Box>
    </>
  );
}
