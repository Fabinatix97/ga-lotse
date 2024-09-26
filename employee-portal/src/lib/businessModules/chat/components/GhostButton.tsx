/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// eslint-disable-next-line no-restricted-imports
import { Link, LinkProps } from "@mui/joy";

export function GhostButton(props: LinkProps) {
  return <Link component="button" level="title-md" {...props} />;
}
