/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Drawer, DrawerProps, ModalClose, Stack, ZIndex } from "@mui/joy";
import { PropsWithChildren, useEffect, useState } from "react";

import {
  findFirstInteractableChild,
  useResetAlertContext,
} from "@eshg/lib-portal";

import { useHeaderHeights } from "../../../hooks/useHeaderHeights";
import { SIDEBAR_PADDING } from "../config/sidebar";

export type SidebarProps = PropsWithChildren<
  Pick<DrawerProps, "open" | "onClose" | "aria-label">
> & { zIndex?: keyof ZIndex };

export function Sidebar({
  open,
  onClose,
  "aria-label": ariaLabel,
  zIndex,
  children,
}: SidebarProps) {
  const resetAlertContext = useResetAlertContext();
  const { headerHeightMobile, headerHeightDesktop } = useHeaderHeights();

  function handleClose(
    ...args: Parameters<NonNullable<DrawerProps["onClose"]>>
  ) {
    if (onClose !== undefined) {
      onClose(...args);
    }
    resetAlertContext();
  }

  const [contentElement, setContentElement] = useState<HTMLElement | null>(
    null,
  );
  useEffect(() => {
    if (contentElement && open) {
      findFirstInteractableChild(contentElement)?.focus();
    }
  }, [contentElement, open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      sx={{ zIndex: zIndex ?? "sidebar" }}
      slotProps={{
        content: {
          "aria-label": ariaLabel,
          sx: {
            width: { xxs: "100vw", xs: "30.5rem" /*488px*/ },
            top: { xxs: `${headerHeightMobile}`, sm: `${headerHeightDesktop}` },
            height: {
              xxs: `calc(100dvh - ${headerHeightMobile})`,
              sm: `calc(100dvh - ${headerHeightDesktop})`,
            },
          },
        },
      }}
      onClose={handleClose}
    >
      <Stack
        sx={{
          padding: SIDEBAR_PADDING,
          flex: "1",
          ["@media (min-height: 400px)"]: {
            overflow: "hidden",
          },
        }}
      >
        <ModalClose
          aria-label="Schließen"
          color="primary"
          variant="outlined"
          sx={{ position: "static", alignSelf: "flex-end" }}
        />
        <Box
          ref={(el: HTMLElement) => {
            setContentElement(el);
          }}
          display="contents"
        >
          {children}
        </Box>
      </Stack>
    </Drawer>
  );
}
