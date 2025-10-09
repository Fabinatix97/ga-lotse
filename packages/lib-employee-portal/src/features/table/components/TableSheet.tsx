/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Sheet, Stack, Theme, styled } from "@mui/joy";
import { ReactElement, ReactNode } from "react";

import { LoadingOverlay, RequiresChildren } from "@eshg/lib-portal";

const StyledSheet = styled(Sheet)(({ theme }) => ({
  flex: 1,
  minHeight: "15rem",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  gap: theme.spacing(2),
}));

interface TableSheetProps extends RequiresChildren {
  loading?: boolean;
  hideTable?: boolean;
  title?: ReactNode;
  invertTitleAndContentDomOrder?: boolean;
  footer?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  role?: string;
}

export function TableSheet(props: TableSheetProps): ReactElement {
  return (
    <StyledSheet
      role={props.role}
      aria-label={props["aria-label"]}
      aria-labelledby={props["aria-labelledby"]}
    >
      <Stack
        flex={1}
        overflow="auto"
        flexDirection={
          props.invertTitleAndContentDomOrder ? "column-reverse" : "column"
        }
      >
        {props.invertTitleAndContentDomOrder && (
          <>
            {props.hideTable ? (
              <Box flex={1} overflow="auto" />
            ) : (
              props.children
            )}
            {props.title}
          </>
        )}
        {!props.invertTitleAndContentDomOrder && (
          <>
            {props.title}
            {props.hideTable ? (
              <Box flex={1} overflow="auto" />
            ) : (
              props.children
            )}
          </>
        )}
      </Stack>
      {props.footer}
      {props.loading && <LoadingOverlay zIndex={zIndexTable} />}
    </StyledSheet>
  );
}

function zIndexTable(theme: Theme): number {
  return theme.zIndex.table;
}
