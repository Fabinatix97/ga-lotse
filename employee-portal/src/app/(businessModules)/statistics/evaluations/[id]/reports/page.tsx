/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetEvaluationReports } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationReports";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";
import { EvaluationReports } from "@/lib/businessModules/statistics/components/evaluations/details/reports/EvaluationReports";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

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
