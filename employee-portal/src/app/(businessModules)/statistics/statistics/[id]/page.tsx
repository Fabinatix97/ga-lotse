/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { StatisticDetailsLayout } from "@/app/(businessModules)/statistics/statistics/[id]/StatisticDetailsLayout";
import { useGetStatisticDetailsPage } from "@/lib/businessModules/statistics/api/queries/useGetStatisticDetailsPage";
import { StatisticDetails } from "@/lib/businessModules/statistics/components/statistics/details/StatisticDetails";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function StatisticDetailPage(
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
    <StatisticDetailsLayout
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
    </StatisticDetailsLayout>
  );
}
