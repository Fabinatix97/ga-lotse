/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
  // eslint-disable-next-line no-restricted-imports
  Link,
  LinkProps,
} from "@mui/joy";

import { NavigationLink } from "./NavigationLink";

type InternalLinkComponent = typeof NavigationLink;
type FixedInternalLinkProps = "component" | "target";

const INTERNAL_LINK_PROPS = {
  component: NavigationLink,
};

export function InternalLink(
  props: Omit<LinkProps<InternalLinkComponent>, FixedInternalLinkProps>,
) {
  return <Link {...INTERNAL_LINK_PROPS} {...props} />;
}

export function InternalLinkButton(
  props: Omit<ButtonProps<InternalLinkComponent>, FixedInternalLinkProps>,
) {
  return <Button {...INTERNAL_LINK_PROPS} {...props} />;
}

export function InternalLinkIconButton(
  props: Omit<IconButtonProps<InternalLinkComponent>, FixedInternalLinkProps>,
) {
  return <IconButton {...INTERNAL_LINK_PROPS} {...props} />;
}
