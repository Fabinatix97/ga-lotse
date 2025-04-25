/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styled } from "@mui/joy";
import { SortDirection } from "@tanstack/react-table";
import { PropsWithChildren } from "react";

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";

import { EDIT_BUTTON_ID } from "@/lib/components/table/addEditColumns";
import { TOGGLE_EXPAND_ID } from "@/lib/helpers/addFeatureColumns";

const StyledHeaderCell = styled("th")(({ theme }) => ({
  "--TableCell-paddingY": theme.spacing(1.5),
  "--TableCell-paddingX": theme.spacing(1.5),
}));

export type HeaderProps = PropsWithChildren<{
  canSort: boolean;
  isSorted: false | SortDirection;
  onSort?: (event: unknown) => void;
  label?: string;
  id?: string;
}>;

const sortLabels = {
  desc: "Absteigend",
  asc: "Aufsteigend",
} as const satisfies Record<SortDirection, string>;

export function Header(props: HeaderProps) {
  const isLink = props.id != TOGGLE_EXPAND_ID && props.id != EDIT_BUTTON_ID;
  return (
    <StyledHeaderCell
      role={isLink ? "columnheader" : "none"}
      aria-label={isLink ? props.label : undefined}
      id={props.id}
    >
      {isLink && (
        <ButtonLink
          underline="none"
          color="neutral"
          textColor={props.isSorted ? "primary.plainColor" : undefined}
          fontWeight="lg"
          onClick={props.onSort}
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
      )}
    </StyledHeaderCell>
  );
}
