/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  SideNavigationItem,
  StickyToolbarLayout,
  Toolbar,
  noCheck,
} from "@eshg/lib-employee-portal";
import {
  AcUnitOutlined,
  AppsOutlined,
  ChatOutlined,
  ErrorOutlineOutlined,
  InsertEmoticonOutlined,
  LightOutlined,
  WavingHandOutlined,
} from "@mui/icons-material";
import {
  Button,
  Chip,
  Divider,
  Stack,
  Switch,
  ToggleButtonGroup,
  Typography,
} from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

import { NavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/items/NavigationItem";
import { CollapsedNavigationList } from "@/lib/baseModule/components/layout/sideNavigation/lists/CollapsedNavigationList";
import { ExpandedNavigationList } from "@/lib/baseModule/components/layout/sideNavigation/lists/ExpandedNavigationList";
import { SideNavItemGroups } from "@/lib/baseModule/components/layout/sideNavigation/types";

const itemGroups: SideNavItemGroups = {
  dashboardItem: [
    {
      type: "SideNavigationLinkItem",
      name: "Single Item",
      href: "#",
      decorator: <LightOutlined />,
      accessCheck: noCheck(),
    },
  ],
  businessItems: [
    {
      type: "SideNavigationLinkItem",
      name: "Dashboard",
      href: "#",
      decorator: <AppsOutlined />,
      accessCheck: noCheck(),
    },
    {
      type: "SideNavigationLinkItem",
      name: "Selected",
      href: "/playground/sideNavigation",
      decorator: <WavingHandOutlined />,
      accessCheck: noCheck(),
    },
    {
      type: "SideNavigationLinkItem",
      name: "Chat",
      href: "#",
      decorator: <ChatOutlined />,
      accessCheck: noCheck(),
      chip: <Chip color="primary">15</Chip>,
    },
    {
      type: "SideNavigationLinkItem",
      name: "Rechtsschutzversicherungsgesellschaften",
      href: "#",
      decorator: <AcUnitOutlined />,
      accessCheck: noCheck(),
    },
  ],
  baseItems: [
    {
      type: "SideNavigationParentItem",
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
      type: "SideNavigationParentItem",
      name: "Selected menu",
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
      type: "SideNavigationParentItem",
      name: "Kraftfahrzeug-Haftpflichtversicherung",
      decorator: <LightOutlined />,
      subItems: [
        { name: "Item", href: "#", accessCheck: noCheck() },
        {
          name: "Item with icon",
          href: "#",
          accessCheck: noCheck(),
          endDecorator: (
            <ErrorOutlineOutlined color="danger" sx={{ fontSize: "1rem" }} />
          ),
        },
      ],
    },
    {
      type: "SideNavigationSuspenseItem",
      name: "Loading endlessly",
      decorator: <LightOutlined />,
      accessCheck: noCheck(),
      component: LoadingItem,
    },
    {
      type: "SideNavigationSuspenseItem",
      name: "Load 5s",
      decorator: <LightOutlined />,
      accessCheck: noCheck(),
      component: SuspendingItem,
    },
    {
      type: "SideNavigationSuspenseItem",
      name: "Fail to load",
      decorator: <LightOutlined />,
      accessCheck: noCheck(),
      component: FailingItem,
    },
  ],
};

function LoadingItem(): ReactNode {
  // Suspend forever
  // eslint-disable-next-line @typescript-eslint/only-throw-error, @typescript-eslint/no-empty-function
  throw new Promise(() => {});
}

function SuspendingItem() {
  useSuspenseQuery({
    queryKey: ["playground", "suspense", "resolve"],
    queryFn: () =>
      new Promise((resolve) => setTimeout(() => resolve("success"), 5000)),
  });

  return (
    <NavigationItem
      item={{
        type: "SideNavigationLinkItem",
        name: "Component",
        decorator: <LightOutlined />,
        href: "#",
        accessCheck: noCheck(),
      }}
    />
  );
}

function FailingItem() {
  useSuspenseQuery({
    queryKey: ["playground", "suspense", "reject"],
    queryFn: () =>
      new Promise((_resolve, reject) =>
        setTimeout(() => reject(new Error("failed")), 5000),
      ),
  });

  return undefined;
}

function ItemStatePlayground() {
  type ItemState = "link" | "parent" | "loading" | "error";
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState(false);
  const [itemState, setItemState] = useState<ItemState>("link");

  const itemStateComponents: Record<ItemState, () => ReactNode> = {
    link: () => (
      <NavigationItem
        item={{
          type: "SideNavigationLinkItem",
          name: "Demo Item",
          decorator: <LightOutlined />,
          accessCheck: noCheck(),
          href: selected ? "/playground/sideNavigation" : "#",
        }}
      />
    ),
    parent: () => (
      <NavigationItem
        item={{
          type: "SideNavigationParentItem",
          name: "Demo Item",
          decorator: <LightOutlined />,
          subItems: [
            {
              name: "Sub Item",
              href: selected ? "/playground/sideNavigation" : "#",
              accessCheck: noCheck(),
            },
            {
              name: "Icon",
              href: selected ? "/playground/sideNavigation" : "#",
              accessCheck: noCheck(),
              endDecorator: (
                <ErrorOutlineOutlined
                  color="danger"
                  sx={{ fontSize: "1rem" }}
                />
              ),
            },
          ],
        }}
      />
    ),
    loading: LoadingItem,
    error: () => {
      throw new Error("Error");
    },
  };

  const item: SideNavigationItem = {
    type: "SideNavigationSuspenseItem",
    name: "Demo Item",
    decorator: <LightOutlined />,
    accessCheck: noCheck(),
    component: itemStateComponents[itemState],
  };

  const itemGroups: SideNavItemGroups = {
    dashboardItem: [item],
    businessItems: [],
    baseItems: [],
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <ToggleButtonGroup
          value={itemState}
          onChange={(_event, newValue) => {
            setItemState(newValue!);
          }}
        >
          <Button value="link">LinkItem</Button>
          <Button value="parent">ParentItem</Button>
          <Button value="loading">LoadingItem</Button>
          <Button value="error">ErrorItem</Button>
        </ToggleButtonGroup>
        <Typography
          component="label"
          endDecorator={
            <Switch
              checked={selected}
              onChange={(event) => setSelected(event.target.checked)}
            />
          }
        >
          Selected
        </Typography>
      </Stack>
      {collapsed ? (
        <CollapsedNavigationList
          key={itemState}
          onExpand={() => {
            setCollapsed(false);
          }}
          itemGroups={itemGroups}
        />
      ) : (
        <ExpandedNavigationList
          key={itemState}
          showCollapseButton={true}
          onCollapse={() => {
            setCollapsed(true);
          }}
          itemGroups={itemGroups}
        />
      )}
    </>
  );
}

export default function SideNavigationPlaygroundPage() {
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="SideNavigation" backHref="/playground" />}
    >
      <MainContentLayout>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <ExpandedNavigationList
              showCollapseButton={true}
              onCollapse={() => {
                alert("Collapse");
              }}
              itemGroups={itemGroups}
            />

            <CollapsedNavigationList
              onExpand={() => {
                alert("Expand");
              }}
              itemGroups={itemGroups}
            />
          </Stack>
          <Divider />
          <ItemStatePlayground />
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
