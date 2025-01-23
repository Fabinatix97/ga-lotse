/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import {
  hasAnyUserRoles,
  hasUserRole,
} from "@eshg/lib-employee-portal/helpers/accessControl";
import { BarChartOutlined } from "@mui/icons-material";
import { isPlainObject } from "remeda";

import { UseSideNavigationItemsResult } from "@/lib/baseModule/components/layout/sideNavigation/types";

import { routes } from "./routes";

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  return {
    isLoading: false,
    items: [
      {
        name: "Statistik",
        decorator: <BarChartOutlined />,
        subItems: [
          {
            name: "Auswertungen",
            href: routes.evaluations.index,
            accessCheck: hasAnyUserRoles([
              ApiUserRole.StatisticsStatisticsRead,
              ApiUserRole.StatisticsStatisticsWrite,
              ApiUserRole.StatisticsStatisticsAdmin,
            ]),
          },
          {
            name: "Reports",
            href: routes.reports.index,
            accessCheck: hasAnyUserRoles([
              ApiUserRole.StatisticsStatisticsRead,
              ApiUserRole.StatisticsStatisticsWrite,
              ApiUserRole.StatisticsStatisticsAdmin,
            ]),
          },
          {
            name: "Geo-Shapes",
            href: routes.geoShapes.index,
            accessCheck: hasUserRole(ApiUserRole.StatisticsStatisticsAdmin),
          },
        ].filter(isPlainObject),
      },
    ],
  };
}
