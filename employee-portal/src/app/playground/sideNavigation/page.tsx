/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import { noCheck } from "@eshg/lib-employee-portal/helpers/accessControl";
import {
  AcUnitOutlined,
  AppsOutlined,
  ChatOutlined,
  InsertEmoticonOutlined,
  LightOutlined,
  WavingHandOutlined,
} from "@mui/icons-material";
import { Chip, Stack } from "@mui/joy";

import { NavigationListCollapsed } from "@/lib/baseModule/components/layout/sideNavigation/lists/NavigationListCollapsed";
import { NavigationListExpanded } from "@/lib/baseModule/components/layout/sideNavigation/lists/NavigationListExpanded";
import { SideNavItemGroups } from "@/lib/baseModule/components/layout/sideNavigation/types";

const itemGroups: SideNavItemGroups = {
  dashboardItem: [
    {
      name: "Single Item",
      href: "#",
      decorator: <LightOutlined />,
      accessCheck: noCheck(),
    },
  ],
  businessItems: [
    {
      name: "Dashboard",
      href: "#",
      decorator: <AppsOutlined />,
      accessCheck: noCheck(),
    },
    {
      name: "Selected",
      href: "/playground/sideNavigation",
      decorator: <WavingHandOutlined />,
      accessCheck: noCheck(),
    },
    {
      name: "Chat",
      href: "#",
      decorator: <ChatOutlined />,
      accessCheck: noCheck(),
      chip: <Chip color="primary">15</Chip>,
    },
    {
      name: "Rechtsschutzversicherungsgesellschaften",
      href: "#",
      decorator: <AcUnitOutlined />,
      accessCheck: noCheck(),
    },
  ],
  baseItems: [
    {
      name: "Hauptmenü",
      decorator: <InsertEmoticonOutlined />,
      subItems: [
        { name: "Benutzer", href: "#", accessCheck: noCheck() },
        { name: "Kalender", href: "#", accessCheck: noCheck() },
        { name: "Ressourcen", href: "#", accessCheck: noCheck() },
        { name: "Zahnärztlicher Dienst", href: "#", accessCheck: noCheck() },
      ],
    },
    {
      name: "Selected menu",
      href: "/playground/sideNavigation",
      decorator: <WavingHandOutlined />,
      subItems: [
        {
          name: "Playground",
          href: "/playground/sideNavigation",
          accessCheck: noCheck(),
        },
        { name: "Other", href: "#", accessCheck: noCheck() },
      ],
    },
    {
      name: "Kraftfahrzeug-Haftpflichtversicherung",
      decorator: <LightOutlined />,
      subItems: [{ name: "Item", href: "#", accessCheck: noCheck() }],
    },
    {
      name: "Noch ein Item",
      decorator: <LightOutlined />,
      error: "error message",
      subItems: [{ name: "Item", href: "#", accessCheck: noCheck() }],
    },
  ],
};

export default function SideNavigationPlaygroundPage() {
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="SideNavigation" backHref="/playground" />}
    >
      <MainContentLayout>
        <Stack direction="row" spacing={2}>
          <NavigationListExpanded
            isLoading={false}
            showCollapseButton={true}
            onCollapse={() => {
              alert("Collapse");
            }}
            itemGroups={itemGroups}
          />

          <NavigationListCollapsed
            onExpand={() => {
              alert("Expand");
            }}
            itemGroups={itemGroups}
          />
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
