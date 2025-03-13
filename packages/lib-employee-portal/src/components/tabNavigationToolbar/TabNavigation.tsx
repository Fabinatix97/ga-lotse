/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ColorPaletteProp, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { AccessCheck, noCheck } from "@/features/auth/accessChecks";
import { useAccessControl } from "@/features/auth/useAccessControl";

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

export function TabNavigation({ items, index }: TabNavigationProps) {
  const checkAccess = useAccessControl();

  const filteredItems = items.filter((item) =>
    checkAccess(item.accessCheck ?? noCheck()),
  );

  return (
    <Stack
      component="nav"
      aria-label="Tab-Navigation"
      direction="row"
      gap={2}
      alignItems="center"
    >
      {filteredItems.map((item) => (
        <TabNavigationItemButton
          key={item.tabButtonName}
          item={item}
          index={index}
        />
      ))}
    </Stack>
  );
}
