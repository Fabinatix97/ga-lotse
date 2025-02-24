/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import { hasUserRole } from "@eshg/lib-employee-portal/helpers/accessControl";
import {
  SideNavigationItem,
  UseSideNavigationItemsResult,
} from "@eshg/lib-employee-portal/types/sideNavigation";
import { isPlainObject } from "remeda";

import { StethoscopeIcon } from "@/lib/businessModules/officialMedicalService/components/icons/StethoscopeIcon";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

const NAVIGATION_ITEMS: SideNavigationItem[] = [
  {
    name: "Amtsärztl. Dienst",
    decorator: <StethoscopeIcon />,
    subItems: [
      {
        name: "Vorgänge",
        href: routes.procedures.index,
        accessCheck: hasUserRole(ApiUserRole.OfficialMedicalServiceAdmin),
      },
      {
        name: "Terminblöcke",
        href: routes.appointmentBlockGroups.index,
        accessCheck: hasUserRole(ApiUserRole.OfficialMedicalServiceAdmin),
      },
      {
        name: "Wartezimmer",
        href: routes.waitingRoom,
        accessCheck: hasUserRole(ApiUserRole.OfficialMedicalServiceAdmin),
      },
    ].filter(isPlainObject),
  },
];

export function useSideNavigationItems(
  enabled: boolean,
): UseSideNavigationItemsResult {
  return {
    isLoading: false,
    items: enabled ? NAVIGATION_ITEMS : [],
  };
}
