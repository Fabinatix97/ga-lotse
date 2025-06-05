/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
// eslint-disable-next-line no-restricted-imports
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

import { useTranslation } from "@/lib/i18n/client";

export interface MainItem {
  name: string;
  path: string;
  decorator: ReactNode;
  subItems?: SubItem[];
}

export interface SubItem {
  name: string;
  path: string;
}

function Item({
  item,
  open,
}: Readonly<{
  item: MainItem | SubItem;
  open?: boolean;
}>) {
  const { t } = useTranslation();
  const curPathname = usePathname();
  const curSearchParams = useSearchParams();
  const isMainItem = "decorator" in item;
  const isItemSelected = isSelected(item.path);

  function isSelected(path: string) {
    if (path.includes("?")) {
      const itemParams = new URL(path, window.location.origin).searchParams;
      if (
        itemParams.has("_orgUnit") &&
        itemParams.get("_orgUnit") === curSearchParams.get("_orgUnit")
      ) {
        return true;
      }
    }
    return curPathname.startsWith(path);
  }

  return (
    <ListItem nested={isMainItem}>
      <ListItemButton
        component={Link}
        href={item.path}
        sx={
          isMainItem
            ? { marginBottom: "0.5rem", padding: open ? undefined : "unset" }
            : {
                marginLeft: "1.25rem",
                padding: "0 0.5rem",
                borderRadius: (theme) => theme.radius.md,
              }
        }
        aria-expanded
        aria-current={!isMainItem && isItemSelected ? "true" : undefined}
        selected={isItemSelected}
      >
        {isMainItem && (
          <ListItemDecorator
            sx={
              !open
                ? {
                    marginInlineEnd: "unset",
                    justifyContent: "center",
                  }
                : {}
            }
          >
            {item.decorator}
          </ListItemDecorator>
        )}
        {open && (
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
              level={isMainItem && isItemSelected ? "title-md" : "body-md"}
            >
              {t(`navigation.${item.name}`, item.name)}
            </Typography>
          </ListItemContent>
        )}
      </ListItemButton>
      {open && isMainItem && item.subItems && (
        <List
          sx={{
            display: "grid",
            visibility: "visible",
            gridTemplateRows: "1fr",
          }}
        >
          {item.subItems.map((subItem) => {
            return <Item key={subItem.name} open={open} item={subItem} />;
          })}
        </List>
      )}
    </ListItem>
  );
}

export function NavigationItem({
  item,
  open,
}: Readonly<{
  item: MainItem;
  open: boolean;
}>) {
  return <Item open={open} item={item} />;
}
