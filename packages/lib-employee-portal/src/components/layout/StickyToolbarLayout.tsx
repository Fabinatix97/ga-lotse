/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box } from "@mui/joy";
import { ReactNode } from "react";

import { useHeaderHeights } from "@/hooks/useHeaderHeights";

interface StickyToolbarLayoutProps {
  children: ReactNode;
  toolbar: ReactNode;
  bottomToolbar?: ReactNode;
}

/**
 * This layout let's you define a toolbar component that is put in a sticky position to the top (just below the header).
 * The children will be placed below the toolbar.
 * No margin or padding is applied to the children.
 *
 * This component should be directly used in page.tsx or layout.tsx files.
 * The MainContentLayout should be passed as children.
 */
export function StickyToolbarLayout(props: StickyToolbarLayoutProps) {
  const { headerHeightMobile, headerHeightDesktop } = useHeaderHeights();
  return (
    <>
      <Box
        sx={{
          position: "sticky",
          zIndex: (theme) => theme.zIndex.toolbar,
          // Keeps the toolbar in place below the header when scrolling the whole page.
          top: {
            xxs: headerHeightMobile,
            sm: headerHeightDesktop,
          },
        }}
      >
        {props.toolbar}
      </Box>

      <Box
        sx={{
          // Take all the available height that is left.
          flex: 1,
          // Flex implies a minimum height of "auto" for flex items (that are not scroll containers).
          // We need to set minHeight to 0 in this case because the child component should provide it's own scroll container if desired.
          // See https://www.w3.org/TR/css-flexbox-1/#min-size-auto
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {props.children}
      </Box>

      <Box
        sx={{
          position: "sticky",
          zIndex: (theme) => theme.zIndex.toolbar,
          bottom: 0,
        }}
      >
        {props.bottomToolbar}
      </Box>
    </>
  );
}
