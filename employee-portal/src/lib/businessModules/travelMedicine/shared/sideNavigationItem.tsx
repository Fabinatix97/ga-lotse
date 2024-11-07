/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiTravelMedicineFeature } from "@eshg/employee-portal-api/travelMedicine";
import { Vaccines } from "@mui/icons-material";
import { isPlainObject } from "remeda";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { UseSideNavigationItemsResult } from "@/lib/baseModule/components/layout/sideNavigation/types";
import { useIsNewFeatureEnabledUnsuspended } from "@/lib/businessModules/travelMedicine/api/queries/featureToggles";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

import { routes } from "./routes";

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  // our toggles
  const {
    data: informationStatementEnabled,
    isError: isErrorCitizenPortalInformationStatement,
    isLoading: isCitizenPortalInformationStatementLoading,
  } = useIsNewFeatureEnabledUnsuspended(
    ApiTravelMedicineFeature.CitizenPortalInformationStatement,
  );

  const isTravelMedicineError = isErrorCitizenPortalInformationStatement;

  // their toggles
  const isInboxEnabled = useIsNewFeatureEnabled(ApiBaseFeature.Inbox);

  return {
    isLoading: isCitizenPortalInformationStatementLoading,
    items: [
      {
        name: "Impfberatung",
        decorator: <Vaccines />,
        error: isTravelMedicineError
          ? "Bei der Verbindung zum Modul Impfberatung ist ein Fehler aufgetreten."
          : undefined,
        subItems: [
          {
            name: "Vorgänge",
            href: routes.procedures.index,
            accessCheck: hasUserRole(ApiUserRole.TravelMedicineAdmin),
          },
          {
            name: "Vorgangssuche",
            href: routes.proceduresSearch.index,
            accessCheck: hasUserRole(ApiUserRole.TravelMedicineAdmin),
          },
          {
            name: "Terminblöcke",
            href: routes.appointmentBlockGroups.index,
            accessCheck: hasUserRole(ApiUserRole.TravelMedicineAdmin),
          },
          {
            name: "Terminarten",
            href: routes.appointmentTypes.index,
            accessCheck: hasUserRole(ApiUserRole.TravelMedicineAdmin),
          },
          {
            name: "Anamnese",
            href: routes.medicalHistoryTemplates.index,
            accessCheck: hasUserRole(ApiUserRole.TravelMedicineAdmin),
          },
          informationStatementEnabled && {
            name: "Aufklärungsbögen",
            href: routes.informationStatementTemplates.index,
            accessCheck: hasUserRole(ApiUserRole.TravelMedicineAdmin),
          },
          {
            name: "Krankheiten",
            href: routes.diseases.index,
            accessCheck: hasUserRole(ApiUserRole.TravelMedicineAdmin),
          },
          {
            name: "Impfstoffe",
            href: routes.vaccines.index,
            accessCheck: hasUserRole(ApiUserRole.TravelMedicineAdmin),
          },
          {
            name: "Sonstige Leistungen",
            href: routes.otherServiceTemplates.index,
            accessCheck: hasUserRole(ApiUserRole.TravelMedicineAdmin),
          },
          isInboxEnabled && {
            name: "Posteingang",
            href: routes.inbox.index,
            accessCheck: hasUserRole(ApiUserRole.TravelMedicineAdmin),
          },
        ].filter(isPlainObject),
      },
    ],
  };
}
