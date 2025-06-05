/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  InternalLinkButton,
  RequiresChildren,
  useIsActiveRoute,
} from "@eshg/lib-portal";

import { getSidePanelNavItemStyles } from "@/lib/shared/components/sidePanel/SidePanelNav";

interface SidePanelNavLinkProps extends RequiresChildren {
  href: string;
}

export function SidePanelNavLink(props: SidePanelNavLinkProps) {
  const isActiveRoute = useIsActiveRoute();
  const isActive = isActiveRoute(props.href);

  return (
    <InternalLinkButton
      {...getSidePanelNavItemStyles(isActive)}
      href={props.href}
      aria-current={isActive ? "true" : undefined}
    >
      {props.children}
    </InternalLinkButton>
  );
}
