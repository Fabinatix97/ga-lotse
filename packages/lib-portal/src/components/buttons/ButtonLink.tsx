/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

// eslint-disable-next-line no-restricted-imports
import { Link, LinkProps } from "@mui/joy";

// Button styled as link
// For internal links with navigation, use the InternalLinkButton instead
export function ButtonLink(
  props: Omit<LinkProps<"button">, "component" | "type">,
) {
  return <Link component="button" type="button" {...props} />;
}
