/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExpandMore } from "@mui/icons-material";
import {
  Box,
  Dropdown,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";

import {
  isItemSelected,
  isSubItemSelected,
} from "@/lib/baseModule/components/layout/navigationMenu/isItemSelected";
import { maxContentWidthDesktop } from "@/lib/baseModule/components/layout/sizes";
import { NavigationItem } from "@/lib/baseModule/components/layout/types";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { GradientIcon } from "@/lib/shared/components/icons/GradientIcon";

export function NavMenu({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  const [anchorEl, setAnchorEl] = useState(undefined);
  const boxRef = useRef(undefined);

  function handleClick() {
    setAnchorEl(boxRef.current);
  }

  return (
    <Box
      component="nav"
      display="flex"
      flexDirection="row"
      flex={1}
      paddingBlock={1}
      ref={boxRef}
    >
      {navigationItems.map((item) => (
        <NavMenuItem
          key={item.name}
          navigationItem={item}
          anchorEl={anchorEl}
          handleClick={handleClick}
        />
      ))}
    </Box>
  );
}

function NavMenuItem({
  navigationItem,
  anchorEl,
  handleClick,
}: {
  navigationItem: NavigationItem;
  anchorEl: HTMLElement | undefined;
  handleClick: () => void;
}) {
  const pathname = usePathname();
  const selected = isItemSelected(navigationItem, pathname);

  const [open, setOpen] = useState(false);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
  }, []);

  return (
    <>
      <NavigationEvents handleOpenChange={handleOpenChange} />
      <Dropdown
        open={open}
        onOpenChange={(_, isOpen) => handleOpenChange(isOpen)}
      >
        <MenuButton
          onClick={handleClick}
          variant="plain"
          size="lg"
          color="primary"
          sx={{
            paddingInline: 2,
            "&[aria-expanded=true]": {
              color: (theme) => `${theme.palette.primary.outlinedColor}`,
            },
          }}
        >
          <Typography
            component="p"
            level="h3"
            fontWeight={selected ? "700" : "500"}
            sx={{
              hyphens: "auto",
              color: (theme) =>
                selected
                  ? theme.palette.primary.outlinedColor
                  : theme.palette.text.primary,
            }}
            endDecorator={<ExpandMore />}
          >
            {navigationItem.name}
          </Typography>
        </MenuButton>
        <Menu
          anchorEl={anchorEl}
          variant="plain"
          sx={{
            display: byBreakpoint({
              mobile: "none",
              desktop: "flex",
            }),
            flexDirection: "row",
            width: maxContentWidthDesktop,
            flexWrap: "wrap",
            padding: 4,
            borderRadius: (theme) => theme.radius.lg,
          }}
        >
          {navigationItem.subItems.map((subItem) => {
            const selected = isSubItemSelected(subItem, pathname);
            return (
              <MenuItem
                key={subItem.name}
                component={NavigationLink}
                href={subItem.href}
                sx={{
                  width: "373px",
                  height: "80px",
                  "&:hover p": {
                    color: (theme) => theme.palette.primary[500],
                  },
                }}
              >
                <ListItemDecorator>
                  <GradientIcon iconClass={subItem.icon} size="md" />
                </ListItemDecorator>
                <Box display={"flex"} flexDirection={"column"}>
                  <Typography
                    level="title-md"
                    color={selected ? "primary" : undefined}
                  >
                    {subItem.name}
                  </Typography>
                  <Typography
                    level="body-md"
                    sx={{
                      color: (theme) =>
                        selected
                          ? theme.palette.primary.solidActiveBg
                          : theme.palette.text.secondary,
                    }}
                  >
                    {subItem.description}
                  </Typography>
                </Box>
              </MenuItem>
            );
          })}
        </Menu>
      </Dropdown>
    </>
  );
}

function NavigationEvents({
  handleOpenChange,
}: {
  handleOpenChange: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    handleOpenChange(false);
  }, [pathname, handleOpenChange]);

  return null;
}
