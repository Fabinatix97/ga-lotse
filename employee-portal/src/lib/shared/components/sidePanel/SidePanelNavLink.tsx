/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { getSidePanelNavItemStyles } from "@/lib/shared/components/sidePanel/SidePanelNav";
import { useIsActiveRoute } from "@/lib/shared/hooks/useIsActiveRoute";

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
