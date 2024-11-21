/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetStatisticReports } from "@/lib/businessModules/statistics/api/queries/useGetStatisticReports";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";
import { StatisticReports } from "@/lib/businessModules/statistics/components/evaluations/details/reports/StatisticReports";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function EvaluationDetailsReportsPage(
  props: Readonly<{ params: { id: string } }>,
) {
  const { data, isFetching } = useGetStatisticReports(props.params.id);

  return (
    <EvaluationDetailsLayout
      statisticId={props.params.id}
      statisticDetailsTabHeaderProps={{
        statisticName: data.title,
      }}
    >
      <MainContentLayout fullViewportHeight>
        <StatisticReports data={data} isFetchingReports={isFetching} />
      </MainContentLayout>
    </EvaluationDetailsLayout>
  );
}
