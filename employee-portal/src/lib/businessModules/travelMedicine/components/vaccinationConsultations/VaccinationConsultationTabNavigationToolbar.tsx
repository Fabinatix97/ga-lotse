/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import {
  PROCEDURE_STATUS_COLORS,
  TabNavigationItem,
  TabNavigationToolbar,
  ToolbarBackButton,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import {
  DocumentScannerOutlined,
  FormatListBulletedOutlined,
  ReceiptOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { isPlainObject } from "remeda";

import { procedureStatusNames } from "@/lib/baseModule/api/procedures/enums";
import {
  useGetStatusQuery,
  useGetVaccinationConsultationDetailsQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { VaccinationConsultationTabHeader } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/VaccinationConsultationTabHeader";
import { routes as businessRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";

export function VaccinationConsultationTabNavigationToolbar({
  id,
}: Readonly<{
  id: string;
}>) {
  const hasTravelMedicineAdminRole = useHasUserRoleCheck(
    ApiUserRole.TravelMedicineAdmin,
  );
  const [{ data: status }, { data: detailsResponse }] = useSuspenseQueries({
    queries: [
      useGetStatusQuery(id),
      useGetVaccinationConsultationDetailsQuery(id),
    ],
  });
  const tabItems = createTabItems(id);

  return (
    <TabNavigationToolbar
      header={
        <VaccinationConsultationTabHeader detailsResponse={detailsResponse} />
      }
      items={tabItems}
      afterTabs={
        <Chip
          data-testid="tab-procedure-state"
          color={PROCEDURE_STATUS_COLORS[status]}
          size="md"
        >
          {procedureStatusNames[status]}
        </Chip>
      }
      backButton={
        hasTravelMedicineAdminRole ? (
          <ToolbarBackButton href={businessRoutes.procedures.index} />
        ) : null
      }
    />
  );
}

function createTabItems(procedureId: string): TabNavigationItem[] {
  return [
    {
      tabButtonName: "Vorgangsdaten",
      href: `${businessRoutes.procedures.baseData(procedureId)}`,
      decorator: <TextSnippetOutlined />,
    },
    {
      tabButtonName: "Anamnese",
      href: `${businessRoutes.procedures.medicalHistories(procedureId)}`,
      decorator: <FormatListBulletedOutlined />,
    },
    {
      tabButtonName: "Aufklärungsbögen",
      href: `${businessRoutes.procedures.informationStatements(procedureId)}`,
      decorator: <DocumentScannerOutlined />,
    },
    {
      tabButtonName: "Bescheinigungen",
      href: `${businessRoutes.procedures.certificates(procedureId)}`,
      decorator: <ReceiptOutlined />,
    },
    {
      tabButtonName: "Verlaufseinträge",
      href: `${businessRoutes.procedures.progressEntries(procedureId)}`,
      decorator: <TimelineOutlined />,
    },
  ].filter(isPlainObject);
}
