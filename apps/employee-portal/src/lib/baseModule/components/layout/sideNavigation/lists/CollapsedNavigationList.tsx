/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { IconButton, Stack, Tooltip } from "@mui/joy";
import { useState } from "react";

import { ExpandNavigation } from "@eshg/lib-portal";

import {
  navItemIconColor,
  sideNavAriaLabel,
} from "@/lib/baseModule/components/layout/sideNavigation/constants";
import { CollapsedNavigationListContext } from "@/lib/baseModule/components/layout/sideNavigation/lists/CollapsedNavigationListContext";
import { NavigationItemGroup } from "@/lib/baseModule/components/layout/sideNavigation/lists/NavigationItemGroup";
import { NavigationListContext } from "@/lib/baseModule/components/layout/sideNavigation/lists/NavigationListContext";
import { SideNavItemGroups } from "@/lib/baseModule/components/layout/sideNavigation/types";
import {
  sideNavigationCollapsedWidth,
  tooltipEnterDelay,
} from "@/lib/baseModule/components/layout/sizes";

export function CollapsedNavigationList({
  onExpand,
  itemGroups,
}: {
  onExpand: () => void;
  itemGroups: SideNavItemGroups;
}) {
  const [openMenuItemName, setOpenMenuItemName] = useState<string | null>(null);

  return (
    <Stack
      component="nav"
      aria-label={sideNavAriaLabel}
      spacing={3}
      sx={{
        width: sideNavigationCollapsedWidth,
        backgroundColor: "background.body",
        paddingTop: 5,
      }}
    >
      <Stack alignItems="center">
        <Tooltip
          title="Menü ausklappen"
          placement="right"
          enterDelay={tooltipEnterDelay}
          enterNextDelay={tooltipEnterDelay}
        >
          <IconButton onClick={onExpand}>
            <ExpandNavigation sx={{ color: navItemIconColor }} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack
        flex={1}
        alignItems="center"
        sx={{ overflowY: "auto", overflowX: "hidden", gap: 3 }}
      >
        <NavigationListContext value>
          <CollapsedNavigationListContext
            value={{ openMenuItemName, setOpenMenuItemName }}
          >
            <NavigationItemGroup itemGroup={itemGroups.dashboardItem} />
            <NavigationItemGroup itemGroup={itemGroups.businessItems} />
            <NavigationItemGroup itemGroup={itemGroups.baseItems} />
          </CollapsedNavigationListContext>
        </NavigationListContext>
      </Stack>
    </Stack>
  );
}
