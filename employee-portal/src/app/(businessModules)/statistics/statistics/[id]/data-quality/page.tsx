/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { StatisticDetailsLayout } from "@/app/(businessModules)/statistics/statistics/[id]/StatisticDetailsLayout";
import { useGetCompletenessInformation } from "@/lib/businessModules/statistics/api/queries/useGetCompletenessInformation";
import { StatisticsDataQuality } from "@/lib/businessModules/statistics/components/statistics/details/dataQuality/StatisticsDataQuality";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function StatisticDataQualityPage(
  props: Readonly<{ params: { id: string } }>,
) {
  const completenessInformation = useGetCompletenessInformation(
    props.params.id,
  );

  return (
    <StatisticDetailsLayout
      statisticId={props.params.id}
      statisticDetailsTabHeaderProps={{
        statisticName: completenessInformation.statisticInfo.name,
      }}
    >
      <MainContentLayout fullViewportHeight>
        <StatisticsDataQuality {...completenessInformation} />
      </MainContentLayout>
    </StatisticDetailsLayout>
  );
}
