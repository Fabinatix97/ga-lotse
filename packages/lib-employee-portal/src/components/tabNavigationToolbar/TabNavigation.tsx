/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Box, ColorPaletteProp, Stack } from "@mui/joy";
import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";

import { useAccessControl } from "../../features/auth/hooks/useAccessControl";
import { AccessCheck, noCheck } from "../../features/auth/utils/accessChecks";

import { TabNavigationItemButton } from "./TabNavigationButton";

export interface TabNavigationItem {
  tabButtonName: string;
  href: string;
  decorator: ReactNode;
  disabled?: boolean;
  color?: ColorPaletteProp;
  accessCheck?: AccessCheck;
  exactMatch?: boolean;
}

interface TabNavigationProps {
  items: TabNavigationItem[];
  index?: string;
}

export function TabNavigation({
  items,
  index: tabNavigationIndex,
}: TabNavigationProps) {
  const checkAccess = useAccessControl();

  const filteredItems = items.filter((item) =>
    checkAccess(item.accessCheck ?? noCheck()),
  );

  const tabs = useRef<(HTMLAnchorElement | null)[]>([]);
  const location = document.location.pathname;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [navigationIndex, setNavigationIndex] = useState(0);

  useEffect(() => {
    const initialIndex = items.findIndex((it) => location.includes(it.href));
    setCurrentIndex(initialIndex);
    setNavigationIndex(initialIndex);
  }, [location, items]);

  function focusTab(index: number) {
    tabs.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === "ArrowRight") {
      const newIndex = (navigationIndex + 1) % tabs.current.length;
      setNavigationIndex(newIndex);
      focusTab(newIndex);
    } else if (event.key === "ArrowLeft") {
      const newIndex =
        (navigationIndex - 1 + tabs.current.length) % tabs.current.length;
      setNavigationIndex(newIndex);
      focusTab(newIndex);
    } else if (event.key === " ") {
      tabs.current[navigationIndex]?.click();
    }
  }

  return (
    <Box component="nav" aria-label="Tab">
      <Stack role="tablist" direction="row" gap={2} alignItems="center">
        {filteredItems.map((item, index) => (
          <TabNavigationItemButton
            key={item.tabButtonName}
            ref={(el: HTMLAnchorElement | null) => (tabs.current[index] = el)}
            item={item}
            index={tabNavigationIndex}
            tabIndex={currentIndex === index ? 0 : -1}
            onKeyDown={onKeyDown}
          />
        ))}
      </Stack>
    </Box>
  );
}
