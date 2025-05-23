/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

// eslint-disable-next-line no-restricted-imports
import { Link, LinkProps } from "@mui/joy";

import { NavigationLink } from "./NavigationLink";

export function InternalLink(
  props: Omit<LinkProps<typeof NavigationLink>, "component">,
) {
  return <Link component={NavigationLink} {...props} />;
}
