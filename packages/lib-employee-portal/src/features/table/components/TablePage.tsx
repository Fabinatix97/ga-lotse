/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Stack, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

const FULL_HEIGHT_STYLES = {
  // Let this component take all the available height.
  flex: 1,
  // Flex implies a minimum height of "auto" for flex items (that are not scroll containers).
  // We need to set minHeight to 0 in this case because the Table component provides it's own scroll container some levels deeper.
  // See https://www.w3.org/TR/css-flexbox-1/#min-size-auto
  minHeight: 0,
};

const PageStack = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "fullHeight",
})<Pick<TablePageProps, "fullHeight">>(({ fullHeight }) =>
  fullHeight ? FULL_HEIGHT_STYLES : {},
);

const FilterStack = styled(Stack)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  flexDirection: "row",
  alignItems: "stretch",
  gap: theme.spacing(3),
}));

const SearchStack = styled(Stack)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export interface TablePageProps extends RequiresChildren {
  "data-testid"?: string;
  "aria-label"?: string;
  controls?: ReactNode;
  sx?: SxProps;
  filterSettings?: ReactNode;
  search?: ReactNode;
  fullHeight?: boolean;
}

export function TablePage(props: Readonly<TablePageProps>) {
  return (
    <PageStack
      fullHeight={props.fullHeight}
      gap={2}
      sx={props.sx}
      data-testid={props["data-testid"]}
      aria-label={props["aria-label"]}
    >
      {props.controls}
      <FilterStack>
        {props.filterSettings}
        <SearchStack>
          {props.search}
          {props.children}
        </SearchStack>
      </FilterStack>
    </PageStack>
  );
}
