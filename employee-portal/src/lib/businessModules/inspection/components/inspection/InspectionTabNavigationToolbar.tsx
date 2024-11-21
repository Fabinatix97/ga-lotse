/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import {
  ApiInspectionFeature,
  ApiInspectionPhase,
} from "@eshg/employee-portal-api/inspection";
import {
  History,
  OtherHousesOutlined,
  SubjectOutlined,
  TextSnippetOutlined,
  TimelapseOutlined,
  TimelineOutlined,
} from "@mui/icons-material";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { useGetInspection } from "@/lib/businessModules/inspection/api/queries/inspection";
import { InspectionTabHeader } from "@/lib/businessModules/inspection/components/inspection/InspectionTabHeader";
import { OfflineSwitch } from "@/lib/businessModules/inspection/components/inspection/OfflineSwitch";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

export function InspectionTabNavigationToolbar({
  inspectionId,
}: Readonly<{
  inspectionId: string;
}>) {
  const isHistoryEnabled = useIsNewFeatureEnabled(
    ApiInspectionFeature.FacilityHistory,
  );
  const hasProcedureEditRole = useHasUserRoleCheck(
    ApiUserRole.InspectionProcedureEdit,
  );
  const { data: inspection } = useGetInspection(inspectionId);
  const tabItems = createTabItems(
    inspectionId,
    inspection.phase,
    isHistoryEnabled,
  );

  return (
    <TabNavigationToolbar
      items={tabItems}
      routeBack={hasProcedureEditRole ? routes.procedures.index : undefined}
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
  isHistoryEnabled: boolean,
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
    isHistoryEnabled
      ? {
          tabButtonName: "Historie",
          href: routes.procedures.history(id),
          decorator: <History />,
        }
      : null,
  ].filter((it) => it !== null);
}
