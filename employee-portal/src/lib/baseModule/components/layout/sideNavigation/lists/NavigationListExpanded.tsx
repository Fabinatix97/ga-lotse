/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SideNavigationItem } from "@eshg/lib-employee-portal/types/sideNavigation";
import { LoadingOverlay } from "@eshg/lib-portal/components/LoadingOverlay";
import { ExpandNavigation } from "@eshg/lib-portal/components/icons/ExpandNavigation";
import { Button, Stack, Typography } from "@mui/joy";

import {
  navItemIconColor,
  sideNavAriaLabel,
} from "@/lib/baseModule/components/layout/sideNavigation/constants";
import { NavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationItem";
import { StyledList } from "@/lib/baseModule/components/layout/sideNavigation/lists/StyledList";
import { SideNavItemGroups } from "@/lib/baseModule/components/layout/sideNavigation/types";
import { sideNavigationWidth } from "@/lib/baseModule/components/layout/sizes";

function NavigationItemGroup(props: { itemGroup: SideNavigationItem[] }) {
  if (props.itemGroup.length === 0) {
    return undefined;
  }
  const list = props.itemGroup.map((item) => {
    return <NavigationItem key={item.name} item={item} />;
  });
  return <StyledList>{list}</StyledList>;
}

export function NavigationListExpanded({
  onCollapse,
  showCollapseButton,
  itemGroups,
  isLoading,
}: {
  onCollapse?: () => void;
  showCollapseButton: boolean;
  itemGroups: SideNavItemGroups;
  isLoading: boolean;
}) {
  return (
    <Stack
      component="nav"
      aria-label={sideNavAriaLabel}
      spacing={3}
      sx={{
        width: { xxs: "100vw", sm: sideNavigationWidth },
        backgroundColor: "background.body",
        paddingTop: 5,
        paddingBottom: 3,
      }}
    >
      {showCollapseButton && (
        <Button
          variant="plain"
          onClick={onCollapse}
          sx={{
            whiteSpace: "nowrap",
            justifyContent: "space-between",
            paddingInline: "0.25rem",
            marginInline: "0.5rem",
            display: "flex",
          }}
        >
          <Typography level="body-sm" textColor="text.secondary">
            Menü einklappen
          </Typography>
          <ExpandNavigation size="md" sx={{ color: navItemIconColor }} />
        </Button>
      )}
      <Stack flex={1} sx={{ overflowY: "auto", paddingInline: 2, gap: 3 }}>
        <NavigationItemGroup itemGroup={itemGroups.dashboardItem} />
        <NavigationItemGroup itemGroup={itemGroups.businessItems} />
        <NavigationItemGroup itemGroup={itemGroups.baseItems} />
        {isLoading && <LoadingOverlay />}
      </Stack>
    </Stack>
  );
}
