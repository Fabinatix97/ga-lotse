/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  DescriptionOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { Chip } from "@mui/joy";

import { procedureStatusNames } from "@/lib/baseModule/api/procedures/enums";
import { useGetProcedureHeader } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { ProcedureDetailsTabHeader } from "@/lib/businessModules/officialMedicalService/components/procedures/details/ProcedureDetailsTabHeader";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { statusColors } from "@/lib/shared/components/procedures/constants";
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
      afterTabs={
        <Chip
          data-testid="tab-procedure-state"
          color={statusColors[procedureHeader.status]}
          size="md"
        >
          {procedureStatusNames[procedureHeader.status]}
        </Chip>
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
      tabButtonName: "Dokumente",
      href: routes.procedures.byId(id).documents,
      decorator: <DescriptionOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.byId(id).progressEntries,
      decorator: <TimelineOutlined />,
    },
  ];
}
