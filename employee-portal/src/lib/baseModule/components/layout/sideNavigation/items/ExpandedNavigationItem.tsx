/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SideNavigationLinkItem,
  SideNavigationParentItem,
  SideNavigationSuspenseItem,
} from "@eshg/lib-employee-portal/types/sideNavigation";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Skeleton,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useId, useState } from "react";

import {
  navItemIconColor,
  navItemSelectedBackgroundColor,
  navItemSelectedIconColor,
} from "@/lib/baseModule/components/layout/sideNavigation/constants";
import { ModuleErrorModal } from "@/lib/baseModule/components/layout/sideNavigation/items/ModuleErrorModal";
import { NavigationItemError } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationItemError";
import { isItemSelected } from "@/lib/baseModule/components/layout/sideNavigation/items/isItemSelected";

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

function listItemButtonStyle(expanded: boolean): SxProps {
  return {
    alignItems: "flex-start",
    padding: spacings.navItemPadding,
    "&.Mui-selected": {
      backgroundColor: navItemSelectedBackgroundColor,
    },
    marginBottom: expanded ? "0.5rem" : 0,
  };
}

function Decorator(props: { selected: boolean; children: ReactNode }) {
  return (
    <ListItemDecorator
      sx={{
        marginTop: spacings.iconTopSpacing,
        "--ListItemDecorator-size": "2rem",
        "--Icon-color": iconColor(props.selected),
      }}
    >
      {props.children}
    </ListItemDecorator>
  );
}

function ItemLabel(props: { selected: boolean; children: ReactNode }) {
  return (
    <ListItemContent>
      <Typography
        sx={{
          marginTop: spacings.textTopSpacing,
          overflowWrap: "break-word",
          hyphens: "auto",
        }}
        component="span"
        level={textStyle(props.selected)}
        textColor={textColor(props.selected)}
      >
        {props.children}
      </Typography>
    </ListItemContent>
  );
}

export function ExpandedNavigationLinkItem({
  item,
}: {
  item: SideNavigationLinkItem;
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
        sx={listItemButtonStyle(false)}
      >
        <Decorator selected={selected}>{item.decorator}</Decorator>
        <ItemLabel selected={selected}>{item.name}</ItemLabel>
        {item.chip}
      </ListItemButton>
    </ListItem>
  );
}

export function ExpandedNavigationErrorItem({
  item,
}: {
  item: SideNavigationSuspenseItem;
}) {
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  return (
    <>
      <ModuleErrorModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        moduleName={item.name}
      />
      <ListItem>
        <ListItemButton
          sx={listItemButtonStyle(false)}
          onClick={() => setErrorModalOpen(true)}
        >
          <NavigationItemError />
          <Decorator selected={false}>{item.decorator}</Decorator>
          <ItemLabel selected={false}>{item.name}</ItemLabel>
        </ListItemButton>
      </ListItem>
    </>
  );
}

export function ExpandedNavigationLoadingItem({
  item,
}: {
  item: SideNavigationSuspenseItem;
}) {
  return (
    <ListItem>
      <ListItemButton sx={listItemButtonStyle(false)} disabled>
        <Decorator selected={false}>
          <Skeleton variant="circular" width={20} height={20}>
            {item.decorator}
          </Skeleton>
        </Decorator>
        <ItemLabel selected={false}>
          <Skeleton>{item.name}</Skeleton>
        </ItemLabel>
      </ListItemButton>
    </ListItem>
  );
}

export function ExpandedNavigationParentItem({
  item,
}: {
  item: SideNavigationParentItem;
}) {
  const buttonId = useId();
  const expandableContentId = useId();

  const pathname = usePathname();

  const selected = item.subItems.some((subItem) => {
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
      <ListItemButton
        role="button"
        onClick={() => setExpanded((prevState) => !prevState)}
        selected={selected && !expanded}
        sx={listItemButtonStyle(expanded)}
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={expandableContentId}
      >
        <Decorator selected={selected}>{item.decorator}</Decorator>
        <ItemLabel selected={selected}>{item.name}</ItemLabel>
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
