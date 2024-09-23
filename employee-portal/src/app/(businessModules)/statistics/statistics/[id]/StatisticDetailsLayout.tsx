/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStatisticsFeature } from "@eshg/employee-portal-api/statistics";
import {
  BookOutlined,
  DiamondOutlined,
  PieChartOutlined,
  TableChartOutlined,
} from "@mui/icons-material";
import { PropsWithChildren } from "react";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/statistics/api/queries/useStatisticsFeatureToggle";
import {
  StatisticDetailsTabHeader,
  StatisticDetailsTabHeaderProps,
} from "@/lib/businessModules/statistics/components/statistics/details/StatisticDetailsTabHeader";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { TabNavigationToolbar } from "@/lib/shared/components/tabNavigationToolbar/TabNavigationToolbar";

export function StatisticDetailsLayout({
  statisticId,
  statisticDetailsTabHeaderProps,
  children,
}: PropsWithChildren<{
  statisticId: string;
  statisticDetailsTabHeaderProps: StatisticDetailsTabHeaderProps;
}>) {
  const statisticReportsEnabled = useIsNewFeatureEnabled(
    ApiStatisticsFeature.Reports,
  );

  const tabNavigationItems: TabNavigationItem[] = [
    {
      href: routes.statistics.details(statisticId).index,
      tabButtonName: "Statistik",
      decorator: <PieChartOutlined />,
      exactMatch: true,
    },
    ...(statisticReportsEnabled
      ? [
          {
            href: routes.statistics.details(statisticId).reports,
            tabButtonName: "Reports",
            decorator: <BookOutlined />,
          },
        ]
      : []),
    {
      href: routes.statistics.details(statisticId).table,
      tabButtonName: "Tabelle",
      decorator: <TableChartOutlined />,
    },
    {
      href: routes.statistics.details(statisticId).dataQuality,
      tabButtonName: "Datenqualität",
      decorator: <DiamondOutlined />,
      exactMatch: true,
    },
  ];

  return (
    <StickyToolbarLayout
      toolbar={
        <TabNavigationToolbar
          routeBack={routes.statistics.index}
          items={tabNavigationItems}
          header={
            <StatisticDetailsTabHeader {...statisticDetailsTabHeaderProps} />
          }
        />
      }
    >
      {children}
    </StickyToolbarLayout>
  );
}
