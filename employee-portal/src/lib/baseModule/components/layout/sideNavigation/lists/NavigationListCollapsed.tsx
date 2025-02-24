/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SideNavigationItem } from "@eshg/lib-employee-portal/types/sideNavigation";
import { ExpandNavigation } from "@eshg/lib-portal/components/icons/ExpandNavigation";
import { IconButton, Stack, Tooltip } from "@mui/joy";
import { useState } from "react";

import {
  navItemIconColor,
  sideNavAriaLabel,
} from "@/lib/baseModule/components/layout/sideNavigation/constants";
import { NavigationIconItem } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationIconItem";
import { NavigationListCollapsedContext } from "@/lib/baseModule/components/layout/sideNavigation/lists/NavigationListCollapsedContext";
import { StyledList } from "@/lib/baseModule/components/layout/sideNavigation/lists/StyledList";
import { SideNavItemGroups } from "@/lib/baseModule/components/layout/sideNavigation/types";
import {
  sideNavigationCollapsedWidth,
  tooltipEnterDelay,
} from "@/lib/baseModule/components/layout/sizes";

function NavigationItemGroup(props: { itemGroup: SideNavigationItem[] }) {
  if (props.itemGroup.length === 0) {
    return undefined;
  }

  const list = props.itemGroup.map((item) => {
    return <NavigationIconItem key={item.name} item={item} />;
  });
  return <StyledList>{list}</StyledList>;
}

export function NavigationListCollapsed({
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
        paddingBottom: 3,
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
        <NavigationListCollapsedContext.Provider
          value={{ openMenuItemName, setOpenMenuItemName }}
        >
          <NavigationItemGroup itemGroup={itemGroups.dashboardItem} />
          <NavigationItemGroup itemGroup={itemGroups.businessItems} />
          <NavigationItemGroup itemGroup={itemGroups.baseItems} />
        </NavigationListCollapsedContext.Provider>
      </Stack>
    </Stack>
  );
}
