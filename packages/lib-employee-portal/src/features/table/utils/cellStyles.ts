/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Theme } from "@mui/joy";
import { ColumnMeta } from "@tanstack/react-table";

export interface StyledCellProps {
  meta: UnknownColumnMeta | undefined;
}

type UnknownColumnMeta = ColumnMeta<unknown, unknown>;

export function getHeaderCellStyles(
  meta: UnknownColumnMeta | undefined,
  theme: Theme,
) {
  const isCheckbox = meta?.cellStyle === "checkbox";
  return {
    ...getCellBaseStyles(meta),
    ...(isCheckbox ? getCheckboxPadding(theme) : {}),
    width: meta?.width,
  };
}

export function getRowCellStyles(
  meta: UnknownColumnMeta | undefined,
  theme: Theme,
  rowDepth: number,
) {
  const isCheckbox = meta?.cellStyle === "checkbox";
  const isButtonOrIcon =
    meta?.cellStyle === "button" || meta?.cellStyle === "icon";
  return {
    ...getCellBaseStyles(meta),
    ...(isCheckbox ? getCheckboxPadding(theme) : {}),
    ...(isButtonOrIcon ? getButtonOrIconPadding(theme) : {}),
    overflow: meta?.cellStyle === "icon" ? "visible" : undefined,
    ...(meta?.indentSubRows ? getSubrowPadding(meta, rowDepth) : {}),
    // ensure width, even if header is not present
    width: meta?.width,
  };
}

function getCellBaseStyles(meta: UnknownColumnMeta | undefined) {
  return {
    textAlign: meta?.textAlign,
  };
}

function getCheckboxPadding(theme: Theme) {
  return {
    "--TableCell-paddingY": theme.spacing(0.75),
    "--TableCell-paddingX": theme.spacing(0.75),
  };
}

function getButtonOrIconPadding(theme: Theme) {
  return {
    "--TableCell-paddingY": theme.spacing(0.5),
    "--TableCell-paddingX": theme.spacing(1),
  };
}

function getSubrowPadding(
  meta: UnknownColumnMeta | undefined,
  rowDepth: number,
) {
  const paddingLeft = meta?.indentSize ? rowDepth * meta?.indentSize : 0;
  return {
    paddingLeft: `${paddingLeft}px`,
    overflow: "visible",
  };
}
