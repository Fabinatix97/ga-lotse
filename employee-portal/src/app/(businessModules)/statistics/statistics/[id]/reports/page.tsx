/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { StatisticDetailsLayout } from "@/app/(businessModules)/statistics/statistics/[id]/StatisticDetailsLayout";
import { useGetStatisticReports } from "@/lib/businessModules/statistics/api/queries/useGetStatisticReports";
import { StatisticReports } from "@/lib/businessModules/statistics/components/statistics/details/reports/StatisticReports";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function StatisticReportsPage(
  props: Readonly<{ params: { id: string } }>,
) {
  const { data, isFetching } = useGetStatisticReports(props.params.id);

  return (
    <StatisticDetailsLayout
      statisticId={props.params.id}
      statisticDetailsTabHeaderProps={{
        statisticName: data.title,
      }}
    >
      <MainContentLayout fullViewportHeight>
        <StatisticReports data={data} isFetchingReports={isFetching} />
      </MainContentLayout>
    </StatisticDetailsLayout>
  );
}
