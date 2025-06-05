/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BarChartOutlined } from "@mui/icons-material";

import { ApiUserRole } from "@eshg/base-api";
import {
  SideNavigationItem,
  hasAnyUserRoles,
  hasUserRole,
} from "@eshg/lib-employee-portal";

import { routes } from "./routes";

export const sideNavigationItems: SideNavigationItem[] = [
  {
    type: "SideNavigationParentItem",
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
    ],
  },
];
