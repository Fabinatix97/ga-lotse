/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ProcedureIcon from "@mui/icons-material/TextSnippetOutlined";
import { ReactNode } from "react";

import { centralFilePlaygroundRoutes } from "@/app/playground/centralFile/centralFilePlaygroundRoutes";
import { updateAvailableNavItem } from "@/lib/shared/components/centralFile/constants";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";

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
          items={navItems}
          routeBack={centralFilePlaygroundRoutes.index}
          header={"Max Mustermann"}
        />
      }
    >
      <MainContentLayout>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
