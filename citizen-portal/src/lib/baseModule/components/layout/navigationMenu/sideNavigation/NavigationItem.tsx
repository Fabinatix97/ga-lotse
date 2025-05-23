/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChevronRightOutlined } from "@mui/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

import { NavigationLink } from "@eshg/lib-portal";

import {
  isItemSelected,
  isSubItemSelected,
} from "@/lib/baseModule/components/layout/navigationMenu/isItemSelected";
import {
  NavigationItem as NavigationItemType,
  SubNavigationItem as SubNavigationItemType,
} from "@/lib/baseModule/components/layout/types";
import { GradientIcon } from "@/lib/shared/components/icons/GradientIcon";

export function NavigationItem({
  item,
  setSelectedItem,
}: {
  item: NavigationItemType;
  setSelectedItem: Dispatch<SetStateAction<NavigationItemType | undefined>>;
}) {
  const pathname = usePathname();

  const selected = isItemSelected(item, pathname);

  return (
    <ListItem>
      <ListItemButton sx={{ padding: 2 }} onClick={() => setSelectedItem(item)}>
        <ListItemContent>
          <Typography
            level="body-md"
            fontWeight="bold"
            color={selected ? "primary" : undefined}
            sx={{ hyphens: "auto", overflowWrap: "break-word" }}
          >
            {item.name}
          </Typography>
        </ListItemContent>
        {item.subItems.length > 0 && <ChevronRightOutlined />}
      </ListItemButton>
    </ListItem>
  );
}

export function SubNavigationItem({
  subItem,
}: {
  subItem: SubNavigationItemType;
}) {
  const pathname = usePathname();

  const selected = isSubItemSelected(subItem, pathname);

  return (
    <ListItem>
      <ListItemButton
        sx={{ padding: 2 }}
        component={NavigationLink}
        href={subItem.href}
      >
        <ListItemDecorator>
          <GradientIcon iconClass={subItem.icon} size="md" />
        </ListItemDecorator>
        <ListItemContent>
          <Typography level="title-sm" color={selected ? "primary" : undefined}>
            {subItem.name}
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              color: (theme) =>
                selected
                  ? theme.palette.primary.solidActiveBg
                  : theme.palette.text.secondary,
            }}
          >
            {subItem.description}
          </Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  );
}
