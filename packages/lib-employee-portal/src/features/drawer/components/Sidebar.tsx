/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useResetAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { Drawer, DrawerProps, ModalClose, Stack, ZIndex } from "@mui/joy";
import { PropsWithChildren } from "react";

import { SIDEBAR_PADDING } from "@/features/drawer/config/sidebar";
import { useHeaderHeights } from "@/hooks/useHeaderHeights";

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

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
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
    >
      <Stack
        sx={{
          padding: SIDEBAR_PADDING,
          flex: "1",
          overflow: "hidden",
        }}
      >
        <ModalClose
          aria-label="Schließen"
          color="primary"
          variant="outlined"
          sx={{ position: "static", alignSelf: "flex-end" }}
        />
        {children}
      </Stack>
    </Drawer>
  );
}
