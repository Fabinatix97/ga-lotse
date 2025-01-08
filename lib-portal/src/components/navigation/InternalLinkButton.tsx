/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, ButtonProps } from "@mui/joy";
import { forwardRef } from "react";

import { NavigationLink } from "./NavigationLink";

export const InternalLinkButton = forwardRef<
  HTMLAnchorElement,
  Omit<ButtonProps<typeof NavigationLink>, "component">
>(function InternalLinkButton(props, ref) {
  return <Button component={NavigationLink} ref={ref} {...props} />;
});
