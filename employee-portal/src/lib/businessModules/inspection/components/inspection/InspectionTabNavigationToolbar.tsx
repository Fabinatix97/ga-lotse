/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  History,
  OtherHousesOutlined,
  SubjectOutlined,
  TextSnippetOutlined,
  TimelapseOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { Stack } from "@mui/joy";

import { ApiUserRole } from "@eshg/base-api";
import {
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import { useIsMobile } from "@eshg/lib-portal/hooks/useIsMobile";

import { useGetInspection } from "@/lib/businessModules/inspection/api/queries/inspection";
import { InspectionLockInfo } from "@/lib/businessModules/inspection/components/inspection/InspectionLockInfo";
import { InspectionTabHeader } from "@/lib/businessModules/inspection/components/inspection/InspectionTabHeader";
import { OfflineSwitch } from "@/lib/businessModules/inspection/components/inspection/OfflineSwitch";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export function InspectionTabNavigationToolbar({
  inspectionId,
}: Readonly<{
  inspectionId: string;
}>) {
  const hasProcedureEditRole = useHasUserRoleCheck(
    ApiUserRole.InspectionProcedureEdit,
  );
  const { data: inspection } = useGetInspection(inspectionId);
  const tabItems = createTabItems(inspectionId);
  const isMobile = useIsMobile();

  return (
    <TabNavigationToolbar
      header={<InspectionTabHeader inspection={inspection} />}
      items={tabItems}
      afterTabs={
        <Stack direction="row">
          {isMobile && <InspectionLockInfo inspection={inspection} />}
          <OfflineSwitch
            procedureId={inspection.externalId}
            currentPhase={inspection.phase}
            label="Offline-Modus"
          />
        </Stack>
      }
      backButton={
        hasProcedureEditRole ? (
          <ToolbarBackButton href={routes.procedures.index} />
        ) : null
      }
    />
  );
}

function createTabItems(id: string): TabNavigationItem[] {
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
      decorator: <OtherHousesOutlined />,
    },
    {
      tabButtonName: "Bericht/Ergebnis",
      href: routes.procedures.reportResult(id),
      decorator: <SubjectOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.progressEntries(id),
      decorator: <TimelineOutlined />,
    },
    {
      tabButtonName: "Historie",
      href: routes.procedures.history(id),
      decorator: <History />,
    },
  ].filter((it) => it !== null);
}
