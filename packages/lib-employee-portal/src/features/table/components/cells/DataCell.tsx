/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { styled } from "@mui/joy";

import { StyledCellProps, getRowCellStyles } from "../../utils/cellStyles";

export const DataCell = styled("td")<
  {
    canNavigate: boolean;
    isClickableElement: boolean;
    rowDepth: number;
  } & StyledCellProps
>(({ theme, meta, canNavigate, isClickableElement, rowDepth }) => {
  return {
    // higher specificity needed to override default style from Joy table
    ".MuiTable-root &": getRowCellStyles(meta, theme, rowDepth),
    "&:hover": canNavigate
      ? {
          cursor: "pointer",
          userSelect: "none",
        }
      : undefined,
    // make entire row linked with `rowNavigationRoute`
    // https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html#Update02 as suggested in the ticket
    "& a[href]::after": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    "& > *": isClickableElement
      ? { zIndex: 1, position: "relative" }
      : undefined,
  };
});
