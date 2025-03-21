/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { styled } from "@mui/joy";

import {
  StyledCellProps,
  getRowCellStyles,
} from "@/features/table/utils/cellStyles";

export const DataCell = styled("td")<
  { canNavigate: boolean } & StyledCellProps
>(({ theme, meta, canNavigate }) => {
  return {
    // higher specificity needed to override default style from Joy table
    ".MuiTable-root &": getRowCellStyles(meta, theme),
    "&:hover": canNavigate
      ? {
          cursor: "pointer",
          userSelect: "none",
        }
      : undefined,
  };
});
