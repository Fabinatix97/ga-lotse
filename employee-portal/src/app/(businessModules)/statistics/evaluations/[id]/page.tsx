/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";

import { useGetEvaluationDetailsPage } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationDetailsPage";
import { EvaluationDetails } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetails";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";

export default function EvaluationDetailsPage(
  props: Readonly<{
    params: { id: string };
  }>,
) {
  const { detailPageInformation, geoShapes } = useGetEvaluationDetailsPage(
    props.params.id,
    {
      onlyActive: true,
      pageSize: 200,
    },
  );

  return (
    <EvaluationDetailsLayout
      evaluationId={props.params.id}
      evaluationDetailsTabHeaderProps={{
        evaluationName: detailPageInformation.title,
      }}
    >
      <MainContentLayout>
        <EvaluationDetails
          {...detailPageInformation}
          choroplethMaps={geoShapes}
        />
      </MainContentLayout>
    </EvaluationDetailsLayout>
  );
}
