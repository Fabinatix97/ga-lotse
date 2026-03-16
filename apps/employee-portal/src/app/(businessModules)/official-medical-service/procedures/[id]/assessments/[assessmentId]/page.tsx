/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal";

import { OfficialMedicalServiceDetailsRouteParamsSchema } from "@/lib/businessModules/officialMedicalService/components/procedures/details/OfficialMedicalServiceDetailsRouteParamsSchema";
import { AssessmentDetailsPage } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/details/AssessmentDetailsPage";

export default async function OfficialMedicalServiceAssessmentDetailsPage(
  props: DynamicPageProps<
    OfficialMedicalServiceDetailsRouteParamsSchema & {
      assessmentId: string;
    }
  >,
) {
  const { id, assessmentId } = await props.params;

  return <AssessmentDetailsPage procedureId={id} assessmentId={assessmentId} />;
}
