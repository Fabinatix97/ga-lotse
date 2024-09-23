/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  FormatListBulletedOutlined,
  MedicalServicesOutlined,
  SubjectOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";

import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";

import { ProcedureTabHeader } from "./ProcedureTabHeader";

export function ProcedureToolbar({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  const tabItems = buildTabItems(procedureId);

  return (
    <TabNavigationToolbar
      items={tabItems}
      routeBack={routes.procedures.index}
      header={<ProcedureTabHeader procedureId={procedureId} />}
    />
  );
}

function buildTabItems(id: string): TabNavigationItem[] {
  return [
    {
      tabButtonName: "Vorgangsdaten",
      href: routes.procedures.byId(id).details,
      decorator: <TextSnippetOutlined />,
    },
    {
      tabButtonName: "Anamnese",
      href: routes.procedures.byId(id).anamnesis,
      decorator: <FormatListBulletedOutlined />,
    },
    {
      tabButtonName: "Untersuchung",
      href: routes.procedures.byId(id).examination,
      decorator: <MedicalServicesOutlined />,
    },
    {
      tabButtonName: "Bericht",
      href: routes.procedures.byId(id).report,
      decorator: <SubjectOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.byId(id).progressEntries.index,
      decorator: <TimelineOutlined />,
    },
  ];
}
