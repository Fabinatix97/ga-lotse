/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiStatisticsFeature } from "@eshg/employee-portal-api/statistics";
import { Leaderboard } from "@mui/icons-material";
import { isPlainObject } from "remeda";

import { UseSideNavigationItemsResult } from "@/lib/baseModule/components/layout/sideNavigation/types";
import { useIsNewFeatureEnabledUnsuspended } from "@/lib/businessModules/statistics/api/queries/useStatisticsFeatureToggle";
import {
  hasAnyUserRoles,
  hasUserRole,
} from "@/lib/shared/helpers/accessControl";

import { routes } from "./routes";

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  const {
    data: statisticsReportsEnabled,
    isError,
    isLoading,
  } = useIsNewFeatureEnabledUnsuspended(ApiStatisticsFeature.Reports);

  return {
    isLoading,
    items: [
      {
        name: "Statistik",
        decorator: <Leaderboard />,
        error: isError
          ? "Bei der Verbindung zum Statistikmodul ist ein Fehler aufgetreten."
          : undefined,
        subItems: [
          {
            name: "Auswertungen",
            href: routes.statistics.index,
            accessCheck: hasAnyUserRoles([
              ApiUserRole.StatisticsStatisticsRead,
              ApiUserRole.StatisticsStatisticsWrite,
              ApiUserRole.StatisticsStatisticsAdmin,
            ]),
          },
          statisticsReportsEnabled && {
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
