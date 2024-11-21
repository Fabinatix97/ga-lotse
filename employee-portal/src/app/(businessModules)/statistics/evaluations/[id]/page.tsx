/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetStatisticDetailsPage } from "@/lib/businessModules/statistics/api/queries/useGetStatisticDetailsPage";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";
import { StatisticDetails } from "@/lib/businessModules/statistics/components/evaluations/details/StatisticDetails";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function EvaluationDetailsPage(
  props: Readonly<{
    params: { id: string };
  }>,
) {
  const { detailPageInformation, geoShapes } = useGetStatisticDetailsPage(
    props.params.id,
    {
      onlyActive: true,
      pageSize: 200,
    },
  );

  return (
    <EvaluationDetailsLayout
      statisticId={props.params.id}
      statisticDetailsTabHeaderProps={{
        statisticName: detailPageInformation.title,
      }}
    >
      <MainContentLayout>
        <StatisticDetails
          {...detailPageInformation}
          choroplethMaps={geoShapes}
        />
      </MainContentLayout>
    </EvaluationDetailsLayout>
  );
}
