/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationHeader";

export interface StatisticDetailsTabHeaderProps {
  statisticName: string;
}

export function StatisticDetailsTabHeader({
  statisticName,
}: StatisticDetailsTabHeaderProps) {
  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>
        {statisticName}
      </TabNavigationHeaderTypography>
    </TabNavigationHeader>
  );
}
