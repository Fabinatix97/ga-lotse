/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";

import { useGetEvaluationReports } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationReports";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";
import { EvaluationReports } from "@/lib/businessModules/statistics/components/evaluations/details/reports/EvaluationReports";

export default function EvaluationDetailsReportsPage(
  props: Readonly<{ params: { id: string } }>,
) {
  const { data, isFetching } = useGetEvaluationReports(props.params.id);

  return (
    <EvaluationDetailsLayout
      evaluationId={props.params.id}
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
