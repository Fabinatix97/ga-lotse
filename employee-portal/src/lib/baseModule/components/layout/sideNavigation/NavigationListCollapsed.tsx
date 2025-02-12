/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExpandNavigation } from "@eshg/lib-portal/components/icons/ExpandNavigation";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import {
  IconButton,
  ListItemContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

import {
  sideNavigationCollapsedWidth,
  tooltipEnterDelay,
} from "@/lib/baseModule/components/layout/sizes";

import {
  NavigationIconItemWithSubItems,
  NavigationIconItemWithoutSubItems,
} from "./NavigationIconItem";
import { StyledList } from "./StyledList";
import { listStyling, navItemIconColor, sideNavAriaLabel } from "./constants";
import { isItemSelected } from "./isItemSelected";
import { SideNavItemGroups, SideNavigationItem } from "./types";

export function NavigationListCollapsed({
  setCollapsed,
  itemGroups,
}: {
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
  itemGroups: SideNavItemGroups;
}) {
  const [openMenuItemName, setOpenMenuItemName] = useState<string | null>(null);

  const itemProps = {
    onClick: () => setOpenMenuItemName(null),
  };
  const pathname = usePathname();

  function createHandleLeaveMenu(itemName: string) {
    return (getIsOnButton: () => boolean) => {
      setTimeout(() => {
        const isOnButton = getIsOnButton();
        if (!isOnButton) {
          setOpenMenuItemName((previousOpenMenuItemName) => {
            if (itemName === previousOpenMenuItemName) {
              return null;
            }
            return previousOpenMenuItemName;
          });
        }
      }, 200);
    };
  }

  function getNavItemGroup(itemGroup: SideNavigationItem[]) {
    if (itemGroup.length === 0) {
      return undefined;
    }

    const list = itemGroup.map((item) => {
      if ("subItems" in item) {
        const isItemMenuOpen = openMenuItemName === item.name;

        return (
          <NavigationIconItemWithSubItems
            key={item.name}
            item={item}
            open={isItemMenuOpen}
            onOpen={() => setOpenMenuItemName(item.name)}
            onLeaveMenu={createHandleLeaveMenu(item.name)}
            selected={
              !isItemMenuOpen &&
              item.subItems.some((subItem) => isItemSelected(subItem, pathname))
            }
            menu={
              <Menu
                onClose={() => setOpenMenuItemName(null)}
                keepMounted={true}
                disablePortal={true}
              >
                <MenuItem disabled>
                  <Typography noWrap level="body-sm">
                    {item.name}
                  </Typography>
                </MenuItem>
                {item.subItems.map((subItem) => (
                  <MenuItem
                    {...itemProps}
                    key={`${subItem.href}-${subItem.name}`}
                    component={NavigationLink}
                    href={subItem.href ?? ""}
                    selected={isItemSelected(subItem, pathname)}
                  >
                    <ListItemContent
                      sx={{
                        borderRadius: (theme) => theme.radius.md,
                        width: "100%",
                      }}
                    >
                      <Typography noWrap component="span">
                        {subItem.name}
                      </Typography>
                    </ListItemContent>
                  </MenuItem>
                ))}
              </Menu>
            }
          >
            {item.decorator}
          </NavigationIconItemWithSubItems>
        );
      }
      return (
        <NavigationIconItemWithoutSubItems
          key={item.name}
          item={item}
          resetActiveIndex={() => setOpenMenuItemName(null)}
        />
      );
    });
    return <StyledList sx={listStyling}>{list}</StyledList>;
  }

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
          <IconButton onClick={() => setCollapsed?.((prevState) => !prevState)}>
            <ExpandNavigation sx={{ color: navItemIconColor }} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack
        flex={1}
        alignItems="center"
        sx={{ overflowY: "auto", overflowX: "hidden", gap: 3 }}
      >
        {getNavItemGroup(itemGroups.dashboardItem)}
        {getNavItemGroup(itemGroups.businessItems)}
        {getNavItemGroup(itemGroups.baseItems)}
      </Stack>
    </Stack>
  );
}
