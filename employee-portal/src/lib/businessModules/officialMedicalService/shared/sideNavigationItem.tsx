/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { isPlainObject } from "remeda";

import { UseSideNavigationItemsResult } from "@/lib/baseModule/components/layout/sideNavigation/types";
import { StethoscopeIcon } from "@/lib/businessModules/officialMedicalService/components/icons/StethoscopeIcon";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  return {
    isLoading: false,
    items: [
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
        ].filter(isPlainObject),
      },
    ],
  };
}
