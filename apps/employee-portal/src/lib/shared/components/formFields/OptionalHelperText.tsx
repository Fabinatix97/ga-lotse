/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormHelperText, styled } from "@mui/joy";
import { PropsWithChildren } from "react";
import { isNullish } from "remeda";

export function OptionalHelperText({
  children,
  id,
}: PropsWithChildren<{ id?: string }>) {
  if (isNullish(children)) {
    return null;
  }
  return <StyledFormHelperText id={id}>{children}</StyledFormHelperText>;
}

const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
  ".Mui-error &": {
    color: theme.palette.danger[500],
  },
}));
