/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetCompletenessInformation } from "@/lib/businessModules/statistics/api/queries/useGetCompletenessInformation";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";
import { EvaluationDataQuality } from "@/lib/businessModules/statistics/components/evaluations/details/dataQuality/EvaluationDataQuality";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function EvaluationDetailsDataQualityPage(
  props: Readonly<{ params: { id: string } }>,
) {
  const completenessInformation = useGetCompletenessInformation(
    props.params.id,
  );

  return (
    <EvaluationDetailsLayout
      evaluationId={props.params.id}
      evaluationDetailsTabHeaderProps={{
        evaluationName: completenessInformation.evaluationInfo.name,
      }}
    >
      <MainContentLayout fullViewportHeight>
        <EvaluationDataQuality {...completenessInformation} />
      </MainContentLayout>
    </EvaluationDetailsLayout>
  );
}
