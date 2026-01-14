/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";

import { useGetCompletenessInformation } from "@/lib/businessModules/statistics/api/queries/useGetCompletenessInformation";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";
import { EvaluationDataQuality } from "@/lib/businessModules/statistics/components/evaluations/details/dataQuality/EvaluationDataQuality";

export default function EvaluationDetailsDataQualityPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const completenessInformation = useGetCompletenessInformation(id);

  return (
    <EvaluationDetailsLayout
      evaluationId={id}
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
