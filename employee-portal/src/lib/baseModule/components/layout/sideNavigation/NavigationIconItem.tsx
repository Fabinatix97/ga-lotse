/**
 * Copyright 2024 cronn GmbH
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
} from "react";
import { isDefined } from "remeda";

import { NavigationItemError } from "@/lib/baseModule/components/layout/sideNavigation/NavigationItemError";
import { tooltipEnterDelay } from "@/lib/baseModule/components/layout/sizes";
import { theme } from "@/lib/baseModule/theme/theme";

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
            "--Icon-color": theme.palette.text.secondary,
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

  const disabled = isDefined(item.error);

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      onOpen(event);
    }
  }

  return (
    <Dropdown
      open={open}
      onOpenChange={(_, isOpen) => {
        if (isOpen) {
          onOpen?.();
        }
      }}
    >
      <ListItem>
        {isDefined(item.error) && <NavigationItemError error={item.error} />}
        <MenuButton
          disabled={disabled}
          slots={{ root: ListItemButton }}
          slotProps={{
            root: {
              selected: !disabled && selected,
              sx: {
                padding: 1,
                "--Icon-color": theme.palette.text.secondary,
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
