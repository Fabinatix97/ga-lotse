/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Stack } from "@mui/joy";

import { TabNavigationItemButton } from "@/lib/shared/components/tabNavigation/TabNavigationButton";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { noCheck } from "@/lib/shared/helpers/accessControl";
import { useAccessControl } from "@/lib/shared/hooks/useAccessControl";

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
