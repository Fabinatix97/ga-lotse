/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  Domain,
  Extension,
  Gavel,
  LibraryBooks,
  MiscellaneousServices,
  Rule,
} from "@mui/icons-material";
import { Button, List, Stack, Typography } from "@mui/joy";
import { useMemo, useState } from "react";
import { prop, sortBy } from "remeda";

import { ExpandNavigation } from "@eshg/lib-portal/components/icons/ExpandNavigation";

import { theme } from "@/lib/components/layout/theme/theme";
import { useHeaderHeights } from "@/lib/components/layout/useHeaderHeights";
import { entityToString } from "@/lib/helpers/entityToString";
import { useOrgUnitsQuery } from "@/lib/hooks/useOrgUnits";
import { useTranslation } from "@/lib/i18n/client";

import { MainItem, NavigationItem, SubItem } from "./NavigationItem";

const items: MainItem[] = [
  {
    name: "orgUnits",
    path: "/org-units",
    decorator: <Domain />,
  },
  {
    name: "actors",
    path: "/actors",
    decorator: <Extension />,
  },
  {
    name: "rules",
    path: "/rules",
    decorator: <Rule />,
  },
  {
    name: "serviceDirectory",
    path: "/service-directory",
    decorator: <MiscellaneousServices />,
  },
  {
    name: "auditLog",
    path: "/audit-log",
    decorator: <LibraryBooks />,
  },
  {
    name: "legal",
    path: "/legal",
    decorator: <Gavel />,
  },
];

export function Navigation() {
  const { data: getOrgUnitsResponse } = useOrgUnitsQuery();
  const [navigationSidebarOpen, setNavigationSidebarOpen] = useState(true);
  const { headerHeightMobile, headerHeightDesktop } = useHeaderHeights();
  const { t } = useTranslation();

  const itemsWithActorSubItems = useMemo<MainItem[]>(() => {
    const orgUnits = getOrgUnitsResponse?.orgUnits ?? [];
    const actorSubItems: SubItem[] = sortBy(
      orgUnits.map((ou) => ({
        path: `/actors?_orgUnit=${ou.readableName}`,
        name: entityToString(ou, true),
      })),
      prop("name"),
    );

    let foundActor = false;
    const result = items.map((v) => {
      if (v.path === "/actors") {
        foundActor = true;
        return { ...v, subItems: actorSubItems };
      }
      return v;
    });

    // eslint-disable-next-line no-console
    console.assert(foundActor, "no item found with '/actors' path");

    return result;
  }, [getOrgUnitsResponse]);

  return (
    <Stack
      flexDirection="column"
      component="nav"
      spacing={3}
      sx={{
        height: {
          xxs: `calc(100vh - ${headerHeightMobile})`,
          sm: `calc(100vh - ${headerHeightDesktop})`,
        },
        width: navigationSidebarOpen ? "300px" : "58px",
        padding: navigationSidebarOpen
          ? theme.spacing(5, 3, 3, 3)
          : theme.spacing(5, 1, 1, 1),
        transition: "width 0.3s ease, padding 0.3s ease",
        boxShadow: theme.shadow.md,
        backgroundColor: theme.palette.background.level2,
        borderRight: "1px solid var(--joy-palette-divider)",
      }}
    >
      <Button
        variant="plain"
        sx={{
          whiteSpace: "nowrap",
          justifyContent: navigationSidebarOpen ? "space-between" : "center",
          paddingInline: "0.5rem",
          marginInline: 3,
          display: "flex",
        }}
        onClick={() => setNavigationSidebarOpen(!navigationSidebarOpen)}
      >
        {navigationSidebarOpen && (
          <Typography level="body-sm" textColor="neutral.700">
            {t("collapseMenu")}
          </Typography>
        )}
        <ExpandNavigation size="md" color="neutral" />
      </Button>
      <List>
        {itemsWithActorSubItems.map((item) => (
          <NavigationItem
            key={item.name}
            open={navigationSidebarOpen}
            item={item}
          />
        ))}
      </List>
    </Stack>
  );
}
