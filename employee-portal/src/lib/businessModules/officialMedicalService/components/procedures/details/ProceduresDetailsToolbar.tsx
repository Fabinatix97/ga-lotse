/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { TextSnippetOutlined, TimelineOutlined } from "@mui/icons-material";

import { useGetProcedureHeader } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { ProcedureDetailsTabHeader } from "@/lib/businessModules/officialMedicalService/components/procedures/details/ProcedureDetailsTabHeader";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

interface ProcedureDetailsToolbarProps {
  id: string;
}

export function ProcedureDetailsToolbar(props: ProcedureDetailsToolbarProps) {
  const hasOfficialMedicalServiceAdminRole = useHasUserRoleCheck(
    ApiUserRole.OfficialMedicalServiceAdmin,
  );
  const { data: procedureHeader } = useGetProcedureHeader(props.id);
  const tabItems = buildTabItems(props.id);

  return (
    <TabNavigationToolbar
      items={tabItems}
      routeBack={
        hasOfficialMedicalServiceAdminRole ? routes.procedures.index : undefined
      }
      header={<ProcedureDetailsTabHeader procedureHeader={procedureHeader} />}
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
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.byId(id).progressEntries.index,
      decorator: <TimelineOutlined />,
    },
  ];
}
