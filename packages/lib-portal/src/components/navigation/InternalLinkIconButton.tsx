/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { IconButton, IconButtonProps } from "@mui/joy";
import { forwardRef } from "react";

import { NavigationLink } from "./NavigationLink";

export const InternalLinkIconButton = forwardRef<
  HTMLAnchorElement,
  Omit<IconButtonProps<typeof NavigationLink>, "component">
>(function InternalLinkIconButton(props, ref) {
  return <IconButton ref={ref} component={NavigationLink} {...props} />;
});
