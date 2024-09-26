/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { LoadingOverlay } from "@eshg/lib-portal/components/LoadingOverlay";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Box, Sheet, Theme, styled } from "@mui/joy";
import { ReactElement, ReactNode } from "react";

export const StyledSheet = styled(Sheet)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  gap: theme.spacing(2),
}));

export interface TableSheetProps extends RequiresChildren {
  loading?: boolean;
  hideTable?: boolean;
  title?: ReactNode;
  footer?: ReactNode;
}

export function TableSheet(props: TableSheetProps): ReactElement {
  return (
    <StyledSheet>
      {props.title}
      {props.hideTable ? <Box flex={1} overflow="auto" /> : props.children}
      {props.footer}
      {props.loading && <LoadingOverlay zIndex={zIndexTable} />}
    </StyledSheet>
  );
}

function zIndexTable(theme: Theme): number {
  return theme.zIndex.table;
}
