/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { LoadingOverlay } from "@eshg/lib-portal/components/LoadingOverlay";
import { ExpandNavigation } from "@eshg/lib-portal/components/icons/ExpandNavigation";
import { Button, Stack, Typography } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import { NavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/NavigationItem";
import { sideNavigationWidth } from "@/lib/baseModule/components/layout/sizes";

import { StyledList } from "./StyledList";
import { listStyling, navItemIconColor, sideNavAriaLabel } from "./constants";
import { SideNavItemGroups, SideNavigationItem } from "./types";

export function NavigationListExpanded({
  setCollapsed,
  showCollapseButton,
  itemGroups,
  isLoading,
}: {
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
  showCollapseButton: boolean;
  itemGroups: SideNavItemGroups;
  isLoading: boolean;
}) {
  function getNavItemGroup(itemGroup: SideNavigationItem[]) {
    if (itemGroup.length > 0) {
      const list = itemGroup.map((item) => {
        return <NavigationItem key={item.name} item={item} />;
      });
      return <StyledList sx={listStyling}>{list}</StyledList>;
    } else return undefined;
  }

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
          onClick={() => setCollapsed?.((prevState) => !prevState)}
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
        {getNavItemGroup(itemGroups.dashboardItem)}
        {getNavItemGroup(itemGroups.businessItems)}
        {getNavItemGroup(itemGroups.baseItems)}
        {isLoading && <LoadingOverlay />}
      </Stack>
    </Stack>
  );
}
