/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiTravelMedicineFeature } from "@eshg/employee-portal-api/travelMedicine";
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
import { useIsNewFeatureEnabled } from "@/lib/businessModules/travelMedicine/api/queries/featureToggles";
import { useGetStatusQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { VaccinationConsultationTabHeader } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/VaccinationConsultationTabHeader";
import { routes as businessRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { statusColors } from "@/lib/shared/components/procedures/constants";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

export function VaccinationConsultationTabNavigationToolbar({
  id,
}: Readonly<{
  id: string;
}>) {
  const hasTravelMedicineAdminRole = useHasUserRoleCheck(
    ApiUserRole.TravelMedicineAdmin,
  );
  const isInformationStatementsEnabled = useIsNewFeatureEnabled(
    ApiTravelMedicineFeature.CitizenPortalInformationStatement,
  );
  const [{ data: status }] = useSuspenseQueries({
    queries: [useGetStatusQuery(id)],
  });
  const tabItems = createTabItems(id, isInformationStatementsEnabled);

  return (
    <TabNavigationToolbar
      routeBack={
        hasTravelMedicineAdminRole ? businessRoutes.procedures.index : undefined
      }
      header={<VaccinationConsultationTabHeader id={id} />}
      afterTabs={
        <Chip data-testid="tab-procedure-state" color={statusColors[status]}>
          {procedureStatusNames[status]}
        </Chip>
      }
      items={tabItems}
    />
  );
}

function createTabItems(
  procedureId: string,
  isInformationStatementsEnabled: boolean,
): TabNavigationItem[] {
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
    isInformationStatementsEnabled && {
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
      href: `${businessRoutes.procedures.progressEntries(procedureId).index}`,
      decorator: <TimelineOutlined />,
    },
  ].filter(isPlainObject);
}
