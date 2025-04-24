/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { TextSnippetOutlined, TimelineOutlined } from "@mui/icons-material";

import { useGetProcedure } from "@/lib/businessModules/medicalRegistry/api/queries/medicalRegistryEntries";
import { MedicalRegistryProcedureChip } from "@/lib/businessModules/medicalRegistry/components/procedures/MedicalRegistryProcedureChip";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";

export function MedicalRegistryTabNavigationToolbar({
  procedureId,
}: Readonly<{
  procedureId: string;
}>) {
  const hasMedicalRegistryAdminRole = useHasUserRoleCheck(
    ApiUserRole.MedicalRegistryAdmin,
  );

  const { data: procedure } = useGetProcedure(procedureId);
  const headerTitle = formatPersonName(procedure.applicant);

  const tabItems: TabNavigationItem[] = [
    {
      tabButtonName: "Eintrag-Details",
      href: routes.procedures.byId(procedureId).details,
      decorator: <TextSnippetOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.byId(procedureId).progressEntries,
      decorator: <TimelineOutlined />,
    },
  ];

  return (
    <TabNavigationToolbar
      items={tabItems}
      header={
        <TabNavigationHeader titleAsH1>
          <TabNavigationHeaderTypography>
            {headerTitle}
          </TabNavigationHeaderTypography>
        </TabNavigationHeader>
      }
      afterTabs={
        <MedicalRegistryProcedureChip
          status={procedure.status}
          type={procedure.procedureType}
          aria-label="Status"
        />
      }
      backButton={
        hasMedicalRegistryAdminRole ? (
          <ToolbarBackButton href={routes.procedures.index} />
        ) : null
      }
    />
  );
}
