/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ArrowDropDown } from "@mui/icons-material";
import { Typography, styled } from "@mui/joy";
import { ColumnMeta, SortDirection } from "@tanstack/react-table";

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { StyledCellProps, getHeaderCellStyles } from "../../utils/cellStyles";

const StyledHeaderCell = styled("th")<StyledCellProps>(({ theme, meta }) => ({
  // higher specificity needed to override default style from Joy table
  ".MuiTable-root &": getHeaderCellStyles(meta, theme),
}));

interface HeaderCellProps extends RequiresChildren {
  canSort: boolean;
  isSorted: false | SortDirection;
  onSort?: (event: unknown) => void;
  meta: ColumnMeta<unknown, unknown> | undefined;
}

const sortLabels = {
  desc: "Absteigend",
  asc: "Aufsteigend",
} as const satisfies Record<SortDirection, string>;

export function HeaderCell(props: HeaderCellProps) {
  return (
    <StyledHeaderCell
      role="columnheader"
      meta={props.meta}
      aria-label={props.meta?.headerLabel}
      aria-sort={props.isSorted ? `${props.isSorted}ending` : undefined}
    >
      {props.canSort ? (
        <ButtonLink
          underline="none"
          color="neutral"
          textColor={props.isSorted ? "primary.plainColor" : "text.primary"}
          fontWeight="lg"
          aria-description="Aktivieren zum Sortieren"
          endDecorator={
            props.canSort && (
              <ArrowDropDown
                aria-label={
                  props.isSorted ? sortLabels[props.isSorted] : undefined
                }
                sx={{ opacity: props.isSorted ? 1 : 0 }}
              />
            )
          }
          sx={{
            "& svg": {
              transform:
                props.isSorted === "desc" ? "rotate(0deg)" : "rotate(180deg)",
            },
            "&:hover": { "& svg": { opacity: 1 } },
          }}
          onClick={props.onSort}
        >
          {props.children}
        </ButtonLink>
      ) : (
        <Typography level="title-sm" color="neutral" textColor="text.primary">
          {props.children}
        </Typography>
      )}
    </StyledHeaderCell>
  );
}
