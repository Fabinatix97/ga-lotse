/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { MedicalServicesOutlined } from "@mui/icons-material";

import { UseSideNavigationItemsResult } from "@/lib/baseModule/components/layout/sideNavigation/types";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

import { routes } from "./routes";

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  return {
    isLoading: false,
    items: [
      {
        name: "Medizinalaufsicht",
        decorator: <MedicalServicesOutlined />,
        href: routes.procedures.index,
        accessCheck: hasUserRole(ApiUserRole.MedicalRegistryAdmin),
      },
    ],
  };
}
