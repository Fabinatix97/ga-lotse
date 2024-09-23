/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  PlaylistAddCheckOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { ReactNode } from "react";

import { MeaslesProtectionProcedureLayout } from "@/lib/businessModules/measlesProtection/layout/MeaslesProtectionProcedureLayout";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";

function createTabItems(id: string): TabNavigationItem[] {
  return [
    {
      tabButtonName: "Vorgangsdaten",
      href: routes.procedures.details(id).index,
      decorator: <TextSnippetOutlined />,
    },
    {
      tabButtonName: "Nachweisprüfung",
      href: routes.procedures.details(id).proof,
      decorator: <PlaylistAddCheckOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.details(id).progressEntries.index,
      decorator: <TimelineOutlined />,
    },
  ];
}

export default function Layout({
  tabs,
  params: { id },
}: {
  params: { id: string };
  tabs: ReactNode;
}) {
  return (
    <MeaslesProtectionProcedureLayout id={id} navItems={createTabItems(id)}>
      {tabs}
    </MeaslesProtectionProcedureLayout>
  );
}
