/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { VaccinesOutlined } from "@mui/icons-material";
import { isPlainObject } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import {
  SideNavigationItem,
  SideNavigationItemsProps,
  hasUserRole,
} from "@eshg/lib-employee-portal";

import { routes } from "./routes";

export function resolveSideNavigationItems({
  isInboxEnabled,
}: SideNavigationItemsProps): SideNavigationItem[] {
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

  return [
    {
      type: "SideNavigationParentItem",
      name: "Impfberatung",
      decorator: <VaccinesOutlined />,
      subItems: SUB_NAVIGATION_ITEMS.filter(isPlainObject),
    },
  ];
}
