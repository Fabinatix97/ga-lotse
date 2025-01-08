/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { IconButton, IconButtonProps } from "@mui/joy";

import { NavigationLink } from "./NavigationLink";

export function InternalLinkIconButton(
  props: Omit<IconButtonProps<typeof NavigationLink>, "component">,
) {
  return <IconButton component={NavigationLink} {...props} />;
}
