/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { use } from "react";

import { useGetEvaluationReports } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationReports";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";
import { EvaluationReports } from "@/lib/businessModules/statistics/components/evaluations/details/reports/EvaluationReports";

export default function EvaluationDetailsReportsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const { data, isFetching } = useGetEvaluationReports(id);

  return (
    <EvaluationDetailsLayout
      evaluationId={id}
      evaluationDetailsTabHeaderProps={{
        evaluationName: data.title,
      }}
    >
      <MainContentLayout fullViewportHeight>
        <EvaluationReports data={data} isFetchingReports={isFetching} />
      </MainContentLayout>
    </EvaluationDetailsLayout>
  );
}
