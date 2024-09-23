/**
 * Copyright 2024 cronn GmbH
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

import { NavigationItemError } from "@/lib/baseModule/components/layout/sideNavigation/NavigationItemError";
import { theme } from "@/lib/baseModule/theme/theme";

import { isItemSelected } from "./isItemSelected";
import {
  SideNavigationItem,
  SideNavigationItemWithSubItems,
  SideNavigationItemWithoutSubItems,
} from "./types";

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
      >
        <ListItemDecorator
          sx={{
            "--Icon-color": theme.palette.text.secondary,
          }}
        >
          {item.decorator}
        </ListItemDecorator>
        <ListItemContent>
          <Typography
            noWrap
            component="span"
            level={selected ? "title-md" : "body-md"}
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

  const disabled = isDefined(item.error);
  const selected =
    !disabled &&
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
      {isDefined(item.error) && <NavigationItemError error={item.error} />}
      <ListItemButton
        role="button"
        onClick={() => setExpanded((prevState) => !prevState)}
        selected={selected && !expanded}
        disabled={disabled}
        sx={{ marginBottom: expanded ? "0.5rem" : 0 }}
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={expandableContentId}
      >
        <ListItemDecorator
          sx={{
            "--Icon-color": theme.palette.text.secondary,
          }}
        >
          {item.decorator}
        </ListItemDecorator>
        <ListItemContent
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Typography
            noWrap
            component="span"
            level={selected ? "title-md" : "body-md"}
          >
            {item.name}
          </Typography>
        </ListItemContent>
        <KeyboardArrowDownIcon
          sx={{
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
                  marginLeft: "1.5rem",
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
                    marginLeft: "1.25rem",
                    padding: "0 0.5rem",
                    borderRadius: (theme) => theme.radius.md,
                  }}
                >
                  <ListItemContent>
                    <Typography noWrap component="span">
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
