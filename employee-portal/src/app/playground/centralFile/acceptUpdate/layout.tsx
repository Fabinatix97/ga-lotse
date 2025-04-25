/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ProcedureIcon from "@mui/icons-material/TextSnippetOutlined";
import { ReactNode } from "react";

import {
  MainContentLayout,
  StickyToolbarLayout,
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import { centralFilePlaygroundRoutes } from "@/app/playground/centralFile/centralFilePlaygroundRoutes";
import { updateAvailableNavItem } from "@/lib/shared/components/centralFile/constants";

const navItems: TabNavigationItem[] = [
  {
    href: centralFilePlaygroundRoutes.acceptUpdate.index,
    tabButtonName: "Vorgangsdaten",
    decorator: <ProcedureIcon />,
    exactMatch: true,
  },
  updateAvailableNavItem(centralFilePlaygroundRoutes.acceptUpdate.applyUpdate),
];

export default function PullChangesFlowLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <StickyToolbarLayout
      toolbar={
        <TabNavigationToolbar
          header={"Max Mustermann"}
          items={navItems}
          backButton={
            <ToolbarBackButton href={centralFilePlaygroundRoutes.index} />
          }
        />
      }
    >
      <MainContentLayout>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
