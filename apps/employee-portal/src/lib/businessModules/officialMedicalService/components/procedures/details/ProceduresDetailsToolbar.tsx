/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApprovalOutlined,
  DescriptionOutlined,
  ListOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { Chip, Typography } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { useSuspenseQueries } from "@tanstack/react-query";

import { ApiUserRole } from "@eshg/base-api";
import {
  PROCEDURE_STATUS_COLORS,
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import { ApiOmsFeature } from "@eshg/official-medical-service-api";

import { procedureStatusNames } from "@/lib/baseModule/api/procedures/enums";
import { useGetProcedureHeaderQuery } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { useEnabledNewFeatureToggleQuery } from "@/lib/businessModules/officialMedicalService/api/queries/feature";
import { ProcedureDetailsTabHeader } from "@/lib/businessModules/officialMedicalService/components/procedures/details/ProcedureDetailsTabHeader";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

interface ProcedureDetailsToolbarProps {
  id: string;
}

export function ProcedureDetailsToolbar(props: ProcedureDetailsToolbarProps) {
  const hasOfficialMedicalServiceAdminRole = useHasUserRoleCheck(
    ApiUserRole.OfficialMedicalServiceAdmin,
  );
  const [{ data: procedureHeader }, { data: assessmentEnabled }] =
    useSuspenseQueries({
      queries: [
        useGetProcedureHeaderQuery(props.id),
        useEnabledNewFeatureToggleQuery(ApiOmsFeature.Assessment),
      ],
    });
  const tabItems = buildTabItems(props.id, assessmentEnabled);

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
          <Typography component="span" sx={visuallyHidden}>
            Status:
          </Typography>
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

function buildTabItems(
  id: string,
  assessmentEnabled: boolean,
): TabNavigationItem[] {
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
    ...(assessmentEnabled
      ? [
          {
            tabButtonName: "Schriftgüter",
            href: routes.procedures.byId(id).assessmentsOverview,
            decorator: <ApprovalOutlined />,
          },
        ]
      : []),
    {
      tabButtonName: "Verlaufseinträge",
      href: routes.procedures.byId(id).progressEntries,
      decorator: <TimelineOutlined />,
    },
  ];
}
