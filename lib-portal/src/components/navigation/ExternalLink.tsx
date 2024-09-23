/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

// eslint-disable-next-line no-restricted-imports
import { Link, LinkProps } from "@mui/joy";

export function ExternalLink(props: Readonly<Omit<LinkProps, "component">>) {
  return <Link {...props} />;
}
