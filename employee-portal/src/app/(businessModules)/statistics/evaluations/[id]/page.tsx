/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { useGetEvaluationDetailsPage } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationDetailsPage";
import { EvaluationDetails } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetails";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";

export default function EvaluationDetailsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = props.params;
  const { detailPageInformation, geoShapes } = useGetEvaluationDetailsPage(id, {
    onlyActive: true,
    pageSize: 200,
  });

  return (
    <EvaluationDetailsLayout
      evaluationId={id}
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
