/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormHelperText } from "@mui/joy";
import { PropsWithChildren } from "react";

export function OptionalHelperText({ children }: PropsWithChildren) {
  if (children == null) {
    return null;
  }
  return <FormHelperText>{children}</FormHelperText>;
}
