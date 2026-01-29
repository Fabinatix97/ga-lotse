/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sheet, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FormEventHandler } from "react";

import { FormPlus, RequiresChildren } from "@eshg/lib-portal";

const StyledSheet = styled(Sheet, {
  shouldForwardProp: (prop) => prop !== "gap",
})<{ gap?: number }>(({ theme, gap }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(gap ?? 3),
})) as typeof Sheet;

interface FormSheetProps extends RequiresChildren {
  id?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  sx?: SxProps;
  gap?: number;
  "aria-label"?: string;
  isSearchForm?: boolean;
  autoFocus?: boolean;
}

export function FormSheet(props: FormSheetProps) {
  return <StyledSheet variant="outlined" component={FormPlus} {...props} />;
}
