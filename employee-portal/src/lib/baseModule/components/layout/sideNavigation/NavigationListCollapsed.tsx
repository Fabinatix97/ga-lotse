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
  const [menuIndex, setMenuIndex] = useState<null | number>(null);

  const itemProps = {
    onClick: () => setMenuIndex(null),
  };
  const pathname = usePathname();
  // eslint-disable-next-line func-style
  const createHandleLeaveMenu =
    (index: number) => (getIsOnButton: () => boolean) => {
      setTimeout(() => {
        const isOnButton = getIsOnButton();
        if (!isOnButton) {
          setMenuIndex((latestIndex: null | number) => {
            if (index === latestIndex) {
              return null;
            }
            return latestIndex;
          });
        }
      }, 200);
    };

  function getNavItemGroup(itemGroup: SideNavigationItem[]) {
    if (itemGroup.length > 0) {
      const list = itemGroup.map((item, index) =>
        "subItems" in item ? (
          <NavigationIconItemWithSubItems
            key={item.name}
            item={item}
            open={menuIndex === index}
            onOpen={() => setMenuIndex(index)}
            onLeaveMenu={createHandleLeaveMenu(index)}
            selected={
              menuIndex !== index &&
              item.subItems.some((subItem) => isItemSelected(subItem, pathname))
            }
            menu={
              <Menu
                onClose={() => setMenuIndex(null)}
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
        ) : (
          <NavigationIconItemWithoutSubItems
            key={`${item.href}-${item.name}`}
            item={item}
            resetActiveIndex={() => setMenuIndex(index)}
          />
        ),
      );
      return <StyledList sx={listStyling}>{list}</StyledList>;
    } else return undefined;
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
