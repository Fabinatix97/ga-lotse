/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  History,
  OtherHousesOutlined,
  SubjectOutlined,
  TextSnippetOutlined,
  TimelapseOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { Stack } from "@mui/joy";

import { useGetInspection } from "@/lib/businessModules/inspection/api/queries/inspection";
import { InspectionLockInfo } from "@/lib/businessModules/inspection/components/inspection/InspectionLockInfo";
import { InspectionTabHeader } from "@/lib/businessModules/inspection/components/inspection/InspectionTabHeader";
import { OfflineSwitch } from "@/lib/businessModules/inspection/components/inspection/OfflineSwitch";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";
import { useIsMobile } from "@/lib/shared/hooks/useIsMobile";

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
      items={tabItems}
      routeBack={hasProcedureEditRole ? routes.procedures.index : undefined}
      header={<InspectionTabHeader inspection={inspection} />}
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
