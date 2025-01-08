/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import {
  Dropdown,
  ListItem,
  ListItemButton,
  MenuButton,
  Tooltip,
} from "@mui/joy";
import { usePathname } from "next/navigation";
import {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  cloneElement,
  useRef,
  useState,
} from "react";
import { isDefined } from "remeda";

import { ModuleErrorModal } from "@/lib/baseModule/components/layout/sideNavigation/ModuleErrorModal";
import { NavigationItemError } from "@/lib/baseModule/components/layout/sideNavigation/NavigationItemError";
import {
  navItemSelectedBackgroundColor,
  navItemSelectedIconColor,
} from "@/lib/baseModule/components/layout/sideNavigation/constants";
import { tooltipEnterDelay } from "@/lib/baseModule/components/layout/sizes";

import { isItemSelected } from "./isItemSelected";
import {
  SideNavigationItemWithSubItems,
  SideNavigationItemWithoutSubItems,
} from "./types";

export function NavigationIconItemWithoutSubItems({
  item,
  resetActiveIndex,
}: {
  item: SideNavigationItemWithoutSubItems;
  resetActiveIndex: () => void;
}) {
  const pathname = usePathname();
  const selected = isItemSelected(item, pathname);

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

interface NavigationIconItemWithSubItemsProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "color"> {
  children: ReactNode;
  menu: ReactElement;
  open: boolean;
  onOpen: (
    event?: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
  ) => void;
  onLeaveMenu: (callback: () => boolean) => void;
  selected: boolean;
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

export function NavigationIconItemWithSubItems({
  children,
  menu,
  open,
  onOpen,
  onLeaveMenu,
  selected,
  item,
}: NavigationIconItemWithSubItemsProps) {
  const isOnButton = useRef(false);

  const isItemError = isDefined(item.error);
  const [openModuleErrorModal, setopenModuleErrorModal] = useState(false);

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      onOpen(event);
    }
  }

  return (
    <Dropdown
      open={open}
      onOpenChange={(_, isOpen) => {
        if (isOpen && !isItemError) {
          onOpen?.();
        }
      }}
    >
      <ListItem
        sx={{
          height: "38px",
        }}
      >
        {isDefined(item.error) && <NavigationItemError />}
        <ModuleErrorModal
          open={openModuleErrorModal}
          onClose={() => setopenModuleErrorModal(false)}
          moduleName={item.name}
        />
        <MenuButton
          slots={{ root: ListItemButton }}
          slotProps={{
            root: {
              selected: !isItemError && selected,
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
            if (!isItemError) {
              onOpen();
            }
          }}
          onClick={() => {
            if (isItemError) {
              setopenModuleErrorModal(true);
            } else {
              onOpen();
            }
          }}
          onMouseEnter={() => {
            if (!isItemError) {
              onOpen();
              isOnButton.current = true;
            }
          }}
          onMouseLeave={() => {
            isOnButton.current = false;
          }}
          onKeyDown={handleButtonKeyDown}
        >
          {children}
        </MenuButton>
      </ListItem>
      {cloneElement(menu, {
        onMouseLeave: () => {
          onLeaveMenu(() => isOnButton.current);
        },
        modifiers,
        slotProps: {
          listbox: {
            id: `nav-example-menu-${item.name}`,
            "aria-label": item.name,
          },
        },
        placement: "right-start",
      })}
    </Dropdown>
  );
}
