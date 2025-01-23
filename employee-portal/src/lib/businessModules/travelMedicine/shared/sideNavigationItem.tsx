/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/base-api";
import { hasUserRole } from "@eshg/lib-employee-portal/helpers/accessControl";
import { VaccinesOutlined } from "@mui/icons-material";
import { isPlainObject } from "remeda";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { UseSideNavigationItemsResult } from "@/lib/baseModule/components/layout/sideNavigation/types";

import { routes } from "./routes";

export function useSideNavigationItems(
  enabled: boolean,
): UseSideNavigationItemsResult {
  // their toggles
  const isInboxEnabled = useIsNewFeatureEnabled(ApiBaseFeature.Inbox);

  const SUB_NAVIGATION_ITEMS = [
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
    {
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
  ];

  return {
    isLoading: false,
    items: enabled
      ? [
          {
            name: "Impfberatung",
            decorator: <VaccinesOutlined />,
            subItems: SUB_NAVIGATION_ITEMS.filter(isPlainObject),
          },
        ]
      : [],
  };
}
