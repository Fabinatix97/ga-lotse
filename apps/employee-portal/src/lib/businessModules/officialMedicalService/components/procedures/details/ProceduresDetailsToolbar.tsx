/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  DescriptionOutlined,
  ListOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { Chip } from "@mui/joy";

import { ApiUserRole } from "@eshg/base-api";
import {
  PROCEDURE_STATUS_COLORS,
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";

import { procedureStatusNames } from "@/lib/baseModule/api/procedures/enums";
import { useGetProcedureHeader } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { ProcedureDetailsTabHeader } from "@/lib/businessModules/officialMedicalService/components/procedures/details/ProcedureDetailsTabHeader";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

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
      header={<ProcedureDetailsTabHeader procedureHeader={procedureHeader} />}
      items={tabItems}
      afterTabs={
        <Chip
          data-testid="tab-procedure-state"
          color={PROCEDURE_STATUS_COLORS[procedureHeader.status]}
          size="md"
        >
          {procedureStatusNames[procedureHeader.status]}
        </Chip>
      }
      backButton={
        hasOfficialMedicalServiceAdminRole ? (
          <ToolbarBackButton href={routes.procedures.index} />
        ) : null
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
      tabButtonName: "Anamnese",
      href: routes.procedures.byId(id).anamnesis,
      decorator: <ListOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.byId(id).progressEntries,
      decorator: <TimelineOutlined />,
    },
  ];
}
