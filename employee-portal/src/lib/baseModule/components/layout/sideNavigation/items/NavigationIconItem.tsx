/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SideNavigationItem,
  SideNavigationItemWithSubItems,
  SideNavigationItemWithoutSubItems,
} from "@eshg/lib-employee-portal/types/sideNavigation";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import {
  Dropdown,
  ListItem,
  ListItemButton,
  ListItemContent,
  Menu,
  MenuButton,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/joy";
import { usePathname } from "next/navigation";
import { KeyboardEvent, useContext, useRef, useState } from "react";
import { isDefined } from "remeda";

import {
  navItemSelectedBackgroundColor,
  navItemSelectedIconColor,
} from "@/lib/baseModule/components/layout/sideNavigation/constants";
import { ModuleErrorModal } from "@/lib/baseModule/components/layout/sideNavigation/items/ModuleErrorModal";
import { NavigationItemError } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationItemError";
import { isItemSelected } from "@/lib/baseModule/components/layout/sideNavigation/items/isItemSelected";
import { NavigationListCollapsedContext } from "@/lib/baseModule/components/layout/sideNavigation/lists/NavigationListCollapsedContext";
import { tooltipEnterDelay } from "@/lib/baseModule/components/layout/sizes";

function NavigationIconItemWithoutSubItems({
  item,
}: {
  item: SideNavigationItemWithoutSubItems;
}) {
  const { setOpenMenuItemName } = useContext(NavigationListCollapsedContext);
  const pathname = usePathname();
  const selected = isItemSelected(item, pathname);

  function resetActiveIndex() {
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
          onMouseEnter={resetActiveIndex}
          onKeyDown={resetActiveIndex}
          onClick={resetActiveIndex}
        >
          {item.decorator}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}

function ErrorNavigationIconItem({
  item,
}: {
  item: SideNavigationItemWithSubItems;
}) {
  const { setOpenMenuItemName } = useContext(NavigationListCollapsedContext);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  function resetActiveIndex() {
    setOpenMenuItemName(null);
  }

  return (
    <>
      <ModuleErrorModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        moduleName={item.name}
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
            onMouseEnter={resetActiveIndex}
            onKeyDown={resetActiveIndex}
            onClick={() => {
              resetActiveIndex();
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

interface NavigationIconItemWithSubItemsProps {
  item: SideNavigationItemWithSubItems;
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

function NavigationIconItemWithSubItems({
  item,
}: NavigationIconItemWithSubItemsProps) {
  const { openMenuItemName, setOpenMenuItemName } = useContext(
    NavigationListCollapsedContext,
  );
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
        onClose={() => setOpenMenuItemName(null)}
        keepMounted={true}
        disablePortal={true}
        onMouseLeave={() => {
          onLeaveMenu(() => isOnButton.current);
        }}
        modifiers={modifiers}
        placement="right-start"
      >
        <MenuItem disabled>
          <Typography noWrap level="body-sm">
            {item.name}
          </Typography>
        </MenuItem>
        {item.subItems.map((subItem) => (
          <MenuItem
            onClick={() => setOpenMenuItemName(null)}
            key={`${subItem.href}-${subItem.name}`}
            component={NavigationLink}
            href={subItem.href ?? ""}
            selected={isItemSelected(subItem, pathname)}
            aria-current={
              isItemSelected(subItem, pathname) ? "page" : undefined
            }
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
    </Dropdown>
  );
}

export function NavigationIconItem({ item }: { item: SideNavigationItem }) {
  if ("subItems" in item) {
    if (isDefined(item.error)) {
      return <ErrorNavigationIconItem item={item} />;
    }
    return <NavigationIconItemWithSubItems item={item} />;
  }
  return <NavigationIconItemWithoutSubItems item={item} />;
}
