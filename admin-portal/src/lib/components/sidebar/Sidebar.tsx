/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Drawer, ModalClose } from "@mui/joy";
import { Dispatch, ReactNode, SetStateAction } from "react";

import { theme } from "@/lib/components/layout/theme/theme";

type SidebarProps = Readonly<{
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
}>;

export function Sidebar({ open, onClose, children }: SidebarProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        onClose((prevState) => !prevState);
      }}
      slotProps={{
        content: {
          sx: {
            width: "unset",
            padding: theme.spacing(3),
            gap: 2,
          },
        },
      }}
    >
      <ModalClose />
      {children}
    </Drawer>
  );
}
