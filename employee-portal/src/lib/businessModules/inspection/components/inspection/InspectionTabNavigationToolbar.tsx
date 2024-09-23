/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspectionPhase } from "@eshg/employee-portal-api/inspection";
import {
  OtherHousesOutlined,
  SubjectOutlined,
  TextSnippetOutlined,
  TimelapseOutlined,
  TimelineOutlined,
} from "@mui/icons-material";

import { useGetInspection } from "@/lib/businessModules/inspection/api/queries/inspection";
import { InspectionTabHeader } from "@/lib/businessModules/inspection/components/inspection/InspectionTabHeader";
import { OfflineSwitch } from "@/lib/businessModules/inspection/components/inspection/OfflineSwitch";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";

export function InspectionTabNavigationToolbar({
  inspectionId,
}: Readonly<{
  inspectionId: string;
}>) {
  const { data: inspection } = useGetInspection(inspectionId);
  const tabItems = createTabItems(inspectionId, inspection.phase);

  return (
    <TabNavigationToolbar
      items={tabItems}
      routeBack={routes.procedures.index}
      header={<InspectionTabHeader inspection={inspection} />}
      afterTabs={
        <OfflineSwitch
          procedureId={inspection.externalId}
          currentPhase={inspection.phase}
          label="Offline-Modus"
        />
      }
    />
  );
}

function createTabItems(
  id: string,
  phase: ApiInspectionPhase,
): TabNavigationItem[] {
  return [
    {
      tabButtonName: "Vorgangsdaten",
      href: routes.procedures.basedata(id),
      decorator: <TextSnippetOutlined />,
    },
    {
      tabButtonName: "Planung",
      href: routes.procedures.planning(id),
      decorator: <TimelapseOutlined />,
    },
    {
      tabButtonName: "Begehung",
      href: routes.procedures.execution(id),
      disabled: inspectionIsBeforePhase(
        phase,
        ApiInspectionPhase.ReadyForExecution,
      ),
      decorator: <OtherHousesOutlined />,
    },
    {
      tabButtonName: "Bericht/Ergebnis",
      href: routes.procedures.reportResult(id),
      disabled: inspectionIsBeforePhase(
        phase,
        ApiInspectionPhase.CreatingReportAndInvoice,
      ),
      decorator: <SubjectOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.progressEntries(id).index,
      decorator: <TimelineOutlined />,
    },
  ];
}
