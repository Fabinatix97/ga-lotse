/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { useIsActiveRoute } from "@eshg/lib-portal/hooks/useIsActiveRoute";
import { useEffect, useRef } from "react";

import { TabNavigationItem } from "./TabNavigation";

interface TabNavigationItemButtonProps {
  item: TabNavigationItem;
  index?: string;
}

export function TabNavigationItemButton({
  index,
  item,
}: TabNavigationItemButtonProps) {
  const isActiveRoute = useIsActiveRoute(index);
  const selected = isActiveRoute(item.href, item.exactMatch);

  const linkRef = useRef<HTMLAnchorElement>(null);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (selected) {
      linkRef.current?.scrollIntoView({
        inline: "center",
        behavior: firstRenderRef.current ? "instant" : "smooth",
      });
    }
    firstRenderRef.current = false;
  }, [selected]);

  return (
    <InternalLinkButton
      ref={linkRef}
      href={item.href}
      disabled={item.disabled}
      startDecorator={item.decorator}
      variant={selected ? "soft" : "plain"}
      color={item.color ?? (selected ? "primary" : "neutral")}
      aria-current={selected ? "true" : undefined}
      sx={{
        fontSize: (theme) => theme.fontSize.md,
        lineHeight: (theme) => theme.lineHeight.sm,
        height: "1rem",
      }}
    >
      {item.tabButtonName}
    </InternalLinkButton>
  );
}
