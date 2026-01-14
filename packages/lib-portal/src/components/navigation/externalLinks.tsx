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

interface BaseLinkProps {
  openInNewTab?: boolean;
}

type ExternalLinkComponent = "a";
type FixedExternalLinkProps = "component" | "target";

interface ExternalLinkProps
  extends BaseLinkProps,
    Omit<LinkProps<ExternalLinkComponent>, FixedExternalLinkProps> {}

export function ExternalLink(props: ExternalLinkProps) {
  const { openInNewTab, ...rest } = props;
  return <Link {...externalLinkProps(openInNewTab)} {...rest} />;
}

interface ExternalLinkButtonProps
  extends BaseLinkProps,
    Omit<ButtonProps<ExternalLinkComponent>, FixedExternalLinkProps> {}

export function ExternalLinkButton(props: ExternalLinkButtonProps) {
  const { openInNewTab, ...rest } = props;
  return <Button {...externalLinkProps(openInNewTab)} {...rest} />;
}

interface ExternalLinkIconButtonProps
  extends BaseLinkProps,
    Omit<IconButtonProps<ExternalLinkComponent>, FixedExternalLinkProps> {}

export function ExternalLinkIconButton(props: ExternalLinkIconButtonProps) {
  const { openInNewTab, ...rest } = props;
  return <IconButton {...externalLinkProps(openInNewTab)} {...rest} />;
}

function externalLinkProps(openInNewTab: boolean | undefined) {
  return {
    component: "a",
    target: openInNewTab ? "_blank" : undefined,
    rel: "noopener noreferrer",
  } satisfies Partial<LinkProps>;
}
