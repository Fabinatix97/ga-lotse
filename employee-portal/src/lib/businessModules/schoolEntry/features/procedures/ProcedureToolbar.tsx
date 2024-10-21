/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import {
  FormatListBulletedOutlined,
  MedicalServicesOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
  VaccinesOutlined,
} from "@mui/icons-material";

import { useGetProcedure } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { ProcedureTabHeader } from "@/lib/businessModules/schoolEntry/features/procedures/ProcedureTabHeader";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

interface ProcedureToolbarProps {
  procedureId: string;
}

export function ProcedureToolbar(props: ProcedureToolbarProps) {
  const hasSchoolEntryAdminRole = useHasUserRoleCheck(
    ApiUserRole.SchoolEntryAdmin,
  );
  const procedure = useGetProcedure(props.procedureId);
  const tabItems = buildTabItems(props.procedureId);

  return (
    <TabNavigationToolbar
      items={tabItems}
      routeBack={
        hasSchoolEntryAdminRole ? routes.procedures.overview : undefined
      }
      header={<ProcedureTabHeader child={procedure.data.child} />}
      afterTabs={
        procedure.data.isClosed ? (
          <span data-testid="procedureStatus">Vorgang geschlossen</span>
        ) : undefined
      }
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
      tabButtonName: "S1 - Anamnese",
      href: routes.procedures.byId(id).anamnesis,
      decorator: <FormatListBulletedOutlined />,
    },
    {
      tabButtonName: "Impfstatus",
      href: routes.procedures.byId(id).vaccination,
      decorator: <VaccinesOutlined />,
    },
    {
      tabButtonName: "Untersuchung",
      href: routes.procedures.byId(id).examinations.index,
      decorator: <MedicalServicesOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.byId(id).progressEntries.index,
      decorator: <TimelineOutlined />,
    },
  ];
}
