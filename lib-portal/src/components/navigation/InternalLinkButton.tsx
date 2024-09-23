/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, ButtonProps } from "@mui/joy";

import { NavigationLink } from "./NavigationLink";

export function InternalLinkButton(
  props: Omit<ButtonProps<typeof NavigationLink>, "component">,
) {
  return <Button component={NavigationLink} {...props} />;
}
