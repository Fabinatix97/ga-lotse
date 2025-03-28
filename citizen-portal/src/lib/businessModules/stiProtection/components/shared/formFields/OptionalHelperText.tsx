/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormHelperText, styled } from "@mui/joy";
import { PropsWithChildren } from "react";

export function OptionalHelperText({
  children,
  id,
}: PropsWithChildren<{ id?: string }>) {
  if (children == null) {
    return null;
  }
  return <StyledFormHelperText id={id}>{children}</StyledFormHelperText>;
}

const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
  ".Mui-error &": {
    color: theme.palette.danger[500],
  },
}));
