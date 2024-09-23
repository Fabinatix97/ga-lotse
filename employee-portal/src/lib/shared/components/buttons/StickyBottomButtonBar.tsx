/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Sheet } from "@mui/joy";

import {
  ButtonBar,
  ButtonBarProps,
} from "@/lib/shared/components/buttons/ButtonBar";

/** Displays a {@link ButtonBar} sticky at the bottom of a page. */
export function StickyBottomButtonBar(props: Readonly<ButtonBarProps>) {
  return (
    <Sheet
      sx={{
        position: "sticky",
        bottom: 0,
        zIndex: (theme) => theme.zIndex.toolbar,
        borderRadius: 0,
      }}
    >
      <ButtonBar {...props} />
    </Sheet>
  );
}
