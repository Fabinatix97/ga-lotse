/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Sheet, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FormEventHandler } from "react";

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
}

export function FormSheet(props: FormSheetProps) {
  return <StyledSheet {...props} variant="outlined" component={FormPlus} />;
}
