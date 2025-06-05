/**
 * Copyright 2025 cronn GmbH
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

interface BaseLinkProps {
  openInNewTab?: boolean;
}

type ExternalLinkComponent = "a";
type FixedExternalLinkProps = "component" | "target";

interface ExternalLinkProps
  extends BaseLinkProps,
    Omit<LinkProps<ExternalLinkComponent>, FixedExternalLinkProps> {}

export function ExternalLink(props: ExternalLinkProps) {
  return <Link {...externalLinkProps(props)} {...props} />;
}

interface ExternalLinkButtonProps
  extends BaseLinkProps,
    Omit<ButtonProps<ExternalLinkComponent>, FixedExternalLinkProps> {}

export function ExternalLinkButton(props: ExternalLinkButtonProps) {
  return <Button {...externalLinkProps(props)} {...props} />;
}

interface ExternalLinkIconButtonProps
  extends BaseLinkProps,
    Omit<IconButtonProps<ExternalLinkComponent>, FixedExternalLinkProps> {}

export function ExternalLinkIconButton(props: ExternalLinkIconButtonProps) {
  return <IconButton {...externalLinkProps(props)} {...props} />;
}

function externalLinkProps(props: BaseLinkProps) {
  return {
    component: "a",
    target: props.openInNewTab ? "_blank" : undefined,
    rel: "noopener noreferrer",
  } satisfies Partial<LinkProps>;
}
