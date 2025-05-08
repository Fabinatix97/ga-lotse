/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Dropdown,
  ListItem,
  ListItemButton,
  ListItemContent,
  Menu,
  MenuButton,
  MenuItem,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/joy";
import { usePathname } from "next/navigation";
import { KeyboardEvent, useRef, useState } from "react";

import {
  SideNavigationLinkItem,
  SideNavigationParentItem,
  SideNavigationSuspenseItem,
} from "@eshg/lib-employee-portal";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";

import {
  navItemSelectedBackgroundColor,
  navItemSelectedIconColor,
} from "@/lib/baseModule/components/layout/sideNavigation/constants";
import { ModuleErrorModal } from "@/lib/baseModule/components/layout/sideNavigation/items/ModuleErrorModal";
import { NavigationItemError } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationItemError";
import { isItemSelected } from "@/lib/baseModule/components/layout/sideNavigation/items/isItemSelected";
import { useCollapsedNavigationListContext } from "@/lib/baseModule/components/layout/sideNavigation/lists/CollapsedNavigationListContext";
import { tooltipEnterDelay } from "@/lib/baseModule/components/layout/sizes";

export function CollapsedNavigationLinkItem({
  item,
}: {
  item: SideNavigationLinkItem;
}) {
  const { setOpenMenuItemName } = useCollapsedNavigationListContext();
  const pathname = usePathname();
  const selected = isItemSelected(item, pathname);

  function closeNavigationMenu() {
    setOpenMenuItemName(null);
  }

  return (
    <ListItem>
      <Tooltip
        title={item.name}
        placement="right"
        enterDelay={tooltipEnterDelay}
        enterNextDelay={tooltipEnterDelay}
      >
        <ListItemButton
          component={NavigationLink}
          href={item.href}
          selected={selected}
          aria-current={selected ? "page" : undefined}
          sx={{
            padding: 1,
            "&.Mui-selected": {
              backgroundColor: navItemSelectedBackgroundColor,
              "--Icon-color": navItemSelectedIconColor,
            },
          }}
          onMouseEnter={closeNavigationMenu}
          onKeyDown={closeNavigationMenu}
          onClick={closeNavigationMenu}
        >
          {item.decorator}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}

export function CollapsedNavigationErrorItem({
  item,
}: {
  item: SideNavigationSuspenseItem;
}) {
  const { setOpenMenuItemName } = useCollapsedNavigationListContext();
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  function closeNavigationMenu() {
    setOpenMenuItemName(null);
  }

  return (
    <>
      <ModuleErrorModal
        open={errorModalOpen}
        moduleName={item.name}
        onClose={() => setErrorModalOpen(false)}
      />
      <ListItem>
        <Tooltip
          title={item.name}
          placement="right"
          enterDelay={tooltipEnterDelay}
          enterNextDelay={tooltipEnterDelay}
        >
          <ListItemButton
            sx={{
              padding: 1,
            }}
            onMouseEnter={closeNavigationMenu}
            onKeyDown={closeNavigationMenu}
            onClick={() => {
              closeNavigationMenu();
              setErrorModalOpen(true);
            }}
          >
            <NavigationItemError />
            {item.decorator}
          </ListItemButton>
        </Tooltip>
      </ListItem>
    </>
  );
}

export function CollapsedNavigationLoadingItem({
  item,
}: {
  item: SideNavigationSuspenseItem;
}) {
  return (
    <ListItem>
      <ListItemButton
        sx={{
          padding: 1,
        }}
        disabled
      >
        <Skeleton variant="circular" width={20} height={20}>
          {item.decorator}
        </Skeleton>
      </ListItemButton>
    </ListItem>
  );
}

const modifiers = [
  {
    name: "offset",
    options: {
      offset: ({ placement }: { placement: string }) => {
        if (placement?.includes?.("end")) {
          return [8, 20];
        }
        return [-8, 20];
      },
    },
  },
];

export function CollapsedNavigationParentItem({
  item,
}: {
  item: SideNavigationParentItem;
}) {
  const { openMenuItemName, setOpenMenuItemName } =
    useCollapsedNavigationListContext();
  const pathname = usePathname();

  const isItemMenuOpen = openMenuItemName === item.name;
  const selected =
    !isItemMenuOpen &&
    item.subItems.some((subItem) => isItemSelected(subItem, pathname));

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

  const onLeaveMenu = createHandleLeaveMenu(item.name);

  const isOnButton = useRef(false);

  function onOpen() {
    setOpenMenuItemName(item.name);
  }

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      onOpen();
    }
  }

  return (
    <Dropdown
      open={isItemMenuOpen}
      onOpenChange={(_, isOpen) => {
        if (isOpen) {
          onOpen();
        }
      }}
    >
      <ListItem
        sx={{
          height: "38px",
        }}
      >
        <MenuButton
          aria-label={item.name}
          slots={{ root: ListItemButton }}
          slotProps={{
            root: {
              selected: selected,
              sx: {
                padding: 1,
                "&.Mui-selected": {
                  backgroundColor: navItemSelectedBackgroundColor,
                  "--Icon-color": navItemSelectedIconColor,
                },
                alignSelf: "unset",
              },
              "aria-haspopup": true,
            },
          }}
          onMouseDown={() => {
            onOpen();
          }}
          onClick={() => {
            onOpen();
          }}
          onMouseEnter={() => {
            onOpen();
            isOnButton.current = true;
          }}
          onMouseLeave={() => {
            isOnButton.current = false;
          }}
          onKeyDown={handleButtonKeyDown}
        >
          {item.decorator}
        </MenuButton>
      </ListItem>
      <Menu
        keepMounted
        disablePortal
        modifiers={modifiers}
        placement="right-start"
        onClose={() => setOpenMenuItemName(null)}
        onMouseLeave={() => {
          onLeaveMenu(() => isOnButton.current);
        }}
      >
        <MenuItem disabled>
          <Typography noWrap level="body-sm">
            {item.name}
          </Typography>
        </MenuItem>
        {item.subItems.map((subItem) => (
          <MenuItem
            key={`${subItem.href}-${subItem.name}`}
            component={NavigationLink}
            href={subItem.href ?? ""}
            selected={isItemSelected(subItem, pathname)}
            aria-current={
              isItemSelected(subItem, pathname) ? "page" : undefined
            }
            onClick={() => setOpenMenuItemName(null)}
          >
            <ListItemContent
              sx={{
                borderRadius: (theme) => theme.radius.md,
                width: "100%",
              }}
            >
              <Typography
                noWrap
                component="span"
                endDecorator={subItem.endDecorator}
              >
                {subItem.name}
              </Typography>
            </ListItemContent>
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
}
