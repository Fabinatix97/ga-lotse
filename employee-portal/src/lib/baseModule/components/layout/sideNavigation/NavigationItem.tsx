/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { isDefined } from "remeda";

import { ModuleErrorModal } from "@/lib/baseModule/components/layout/sideNavigation/ModuleErrorModal";
import { NavigationItemError } from "@/lib/baseModule/components/layout/sideNavigation/NavigationItemError";
import {
  navItemIconColor,
  navItemSelectedBackgroundColor,
  navItemSelectedIconColor,
} from "@/lib/baseModule/components/layout/sideNavigation/constants";

import { isItemSelected } from "./isItemSelected";
import {
  SideNavigationItem,
  SideNavigationItemWithSubItems,
  SideNavigationItemWithoutSubItems,
} from "./types";

function textColor(selected: boolean) {
  return selected ? "primary.softColor" : "text.primary";
}

function textStyle(selected: boolean) {
  return selected ? "title-md" : "body-md";
}

function iconColor(selected: boolean) {
  return selected ? navItemSelectedIconColor : navItemIconColor;
}

const spacings = {
  iconTopSpacing: "0.1875rem", // 3px
  textTopSpacing: "0.125rem", // 2px
  navItemPadding: "0.375rem",
};

function NavigationItemWithoutSubItems({
  item,
}: {
  item: SideNavigationItemWithoutSubItems;
}) {
  const pathname = usePathname();

  const selected = isItemSelected(item, pathname);

  return (
    <ListItem>
      <ListItemButton
        component={NavigationLink}
        href={item.href}
        selected={selected}
        aria-current={selected ? "page" : undefined}
        sx={{
          padding: spacings.navItemPadding,
          alignItems: "flex-start",
          "&.Mui-selected": {
            backgroundColor: navItemSelectedBackgroundColor,
          },
        }}
      >
        <ListItemDecorator
          sx={{
            marginTop: spacings.iconTopSpacing,
            "--Icon-color": iconColor(selected),
            "--ListItemDecorator-size": "2rem",
          }}
        >
          {item.decorator}
        </ListItemDecorator>
        <ListItemContent>
          <Typography
            sx={{ marginTop: spacings.textTopSpacing }}
            component="span"
            level={textStyle(selected)}
            textColor={textColor(selected)}
          >
            {item.name}
          </Typography>
        </ListItemContent>
        {item.chip}
      </ListItemButton>
    </ListItem>
  );
}

function NavigationItemWithSubItems({
  item,
}: {
  item: SideNavigationItemWithSubItems;
}) {
  const buttonId = useId();
  const expandableContentId = useId();

  const pathname = usePathname();
  const [openModuleErrorModal, setopenModuleErrorModal] = useState(false);

  const isItemError = isDefined(item.error);
  const selected =
    !isItemError &&
    item.subItems.some((subItem) => {
      return isItemSelected(subItem, pathname);
    });
  const [expanded, setExpanded] = useState(selected);

  useEffect(() => {
    if (selected) {
      setExpanded(selected);
    }
  }, [selected]);

  return (
    <ListItem nested>
      {isDefined(item.error) && <NavigationItemError />}
      <ModuleErrorModal
        open={openModuleErrorModal}
        onClose={() => setopenModuleErrorModal(false)}
        moduleName={item.name}
      />
      <ListItemButton
        role="button"
        onClick={
          isItemError
            ? () => setopenModuleErrorModal(true)
            : () => setExpanded((prevState) => !prevState)
        }
        selected={selected && !expanded}
        sx={{
          alignItems: "flex-start",
          marginBottom: expanded ? "0.5rem" : 0,
          padding: spacings.navItemPadding,
        }}
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={expandableContentId}
      >
        <ListItemDecorator
          sx={{
            marginTop: spacings.iconTopSpacing,
            "--ListItemDecorator-size": "2rem",
            "--Icon-color": iconColor(selected),
          }}
        >
          {item.decorator}
        </ListItemDecorator>
        <ListItemContent
          sx={{
            marginTop: spacings.textTopSpacing,
            marginRight: 1,
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{ hyphens: "auto" }}
            component="span"
            level={textStyle(selected)}
            textColor={textColor(selected)}
          >
            {item.name}
          </Typography>
        </ListItemContent>
        <KeyboardArrowDownIcon
          sx={{
            marginTop: spacings.iconTopSpacing,
            transform: expanded ? "rotate(180deg)" : "none",
            marginLeft: -1.5,
          }}
        />
      </ListItemButton>
      <Box
        sx={{
          display: "grid",
          visibility: expanded ? "visible" : "hidden",
          gridTemplateRows: expanded ? "1fr" : "0fr",
          transition: "0.2s ease",
          "@media (prefers-reduced-motion)": {
            transition: "none",
          },
          "& > *": {
            overflow: "hidden",
          },
        }}
        id={expandableContentId}
        aria-labelledby={buttonId}
      >
        <List>
          {item.subItems.map((subItem) => {
            const selectedChild = isItemSelected(subItem, pathname);

            return (
              <Box
                key={`${subItem.href}-${subItem.name}`}
                component="li"
                paddingY="0.25rem"
                sx={{
                  borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 0,
                  marginLeft: "1rem",
                  marginRight: "0.25rem",
                  "&:first-of-type": {
                    paddingTop: 0,
                    marginTop: "0.5rem",
                  },
                  "&:last-of-type": {
                    paddingBottom: 0,
                    marginBottom: 0.5,
                  },
                }}
              >
                <ListItemButton
                  component={NavigationLink}
                  href={subItem.href}
                  selected={selectedChild}
                  aria-current={selectedChild ? "page" : undefined}
                  sx={{
                    marginLeft: "0.8125rem",
                    padding: "0 0.5rem",
                    borderRadius: (theme) => theme.radius.md,
                    "&.Mui-selected": {
                      backgroundColor: navItemSelectedBackgroundColor,
                    },
                  }}
                >
                  <ListItemContent>
                    <Typography
                      component="span"
                      sx={{
                        hyphens: "auto",
                      }}
                      level={textStyle(selectedChild)}
                      textColor={textColor(selectedChild)}
                    >
                      {subItem.name}
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
              </Box>
            );
          })}
        </List>
      </Box>
    </ListItem>
  );
}

export function NavigationItem({ item }: { item: SideNavigationItem }) {
  if ("subItems" in item) {
    return <NavigationItemWithSubItems item={item} />;
  }

  return <NavigationItemWithoutSubItems item={item} />;
}
