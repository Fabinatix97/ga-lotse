/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Typography, styled } from "@mui/joy";
import { ColumnMeta, SortDirection } from "@tanstack/react-table";
import { PropsWithChildren, useId } from "react";

import {
  StyledCellProps,
  getHeaderCellStyles,
} from "@/lib/shared/components/table/cellStyles";

const StyledHeaderCell = styled("th")<StyledCellProps>(({ theme, meta }) => ({
  // higher specificity needed to override default style from Joy table
  ".MuiTable-root &": getHeaderCellStyles(meta, theme),
}));

export type HeaderProps = PropsWithChildren<{
  canSort: boolean;
  isSorted: false | SortDirection;
  onSort?: (event: unknown) => void;
  meta: ColumnMeta<unknown, unknown> | undefined;
}>;

const sortLabels = {
  desc: "Absteigend",
  asc: "Aufsteigend",
} as const satisfies Record<SortDirection, string>;

export function Header(props: HeaderProps) {
  const id = useId();
  return (
    <>
      <span hidden={true} id={id}>
        Aktivieren zum Sortieren
      </span>
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
            onClick={props.onSort}
            aria-describedby={id}
            endDecorator={
              props.canSort && (
                <ArrowDropDownIcon
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
          >
            {props.children}
          </ButtonLink>
        ) : (
          <Typography level="title-sm" color="neutral" textColor="text.primary">
            {props.children}
          </Typography>
        )}
      </StyledHeaderCell>
    </>
  );
}
