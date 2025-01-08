/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { useEffect, useRef } from "react";

import { theme } from "@/lib/baseModule/theme/theme";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { useIsActiveRoute } from "@/lib/shared/hooks/useIsActiveRoute";

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
        fontSize: theme.fontSize.md,
        lineHeight: theme.lineHeight.sm,
        height: "1rem",
      }}
    >
      {item.tabButtonName}
    </InternalLinkButton>
  );
}
