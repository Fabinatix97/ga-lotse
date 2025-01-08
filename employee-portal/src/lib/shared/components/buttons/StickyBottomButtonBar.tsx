/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Sheet } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import {
  ButtonBar,
  ButtonBarProps,
} from "@/lib/shared/components/buttons/ButtonBar";

export interface StickyBottomButtonBarProps extends ButtonBarProps {
  sx?: SxProps;
}

/** Displays a {@link ButtonBar} sticky at the bottom of a page. */
export function StickyBottomButtonBar(
  props: Readonly<StickyBottomButtonBarProps>,
) {
  const { sx: barSx, ...buttons } = props;
  return (
    <Sheet
      sx={{
        position: "sticky",
        bottom: 0,
        zIndex: (theme) => theme.zIndex.toolbar,
        borderRadius: 0,
        ...barSx,
      }}
    >
      <ButtonBar {...buttons} />
    </Sheet>
  );
}
