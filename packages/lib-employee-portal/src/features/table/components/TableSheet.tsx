/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Sheet, Stack, Theme, styled } from "@mui/joy";
import { ReactElement, ReactNode } from "react";

import { LoadingOverlay } from "@eshg/lib-portal/components/LoadingOverlay";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

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
  footer?: ReactNode;
  "aria-label"?: string;
}

export function TableSheet(props: TableSheetProps): ReactElement {
  return (
    <StyledSheet aria-label={props["aria-label"]}>
      <Stack flex={1} overflow="auto">
        {props.title}
        {props.hideTable ? (
          <Box flex={1} overflow="auto"></Box>
        ) : (
          props.children
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
