/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { KeyboardEventHandler, useEffect, useRef } from "react";

import { InternalLinkButton, useIsActiveRoute } from "@eshg/lib-portal";

import { TabNavigationItem } from "./TabNavigation";

interface TabNavigationItemButtonProps {
  item: TabNavigationItem;
  index?: string;
  tabIndex: number;
  ref: (el: HTMLAnchorElement | null) => void;
  onKeyDown: KeyboardEventHandler<HTMLAnchorElement>;
}

export function TabNavigationItemButton({
  index,
  item,
  tabIndex,
  ref,
  onKeyDown,
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
      ref={(el) => {
        linkRef.current = el;
        ref(el);
      }}
      role="tab"
      tabIndex={tabIndex}
      href={item.href}
      disabled={item.disabled}
      startDecorator={item.decorator}
      variant={selected ? "soft" : "plain"}
      color={item.color ?? (selected ? "primary" : "neutral")}
      aria-selected={selected ? "true" : undefined}
      sx={{
        fontSize: (theme) => theme.fontSize.md,
        lineHeight: (theme) => theme.lineHeight.sm,
        height: "1rem",
      }}
      onKeyDown={onKeyDown}
    >
      {item.tabButtonName}
    </InternalLinkButton>
  );
}
