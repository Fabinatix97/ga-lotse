/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal";

import { OfficialMedicalServiceDetailsRouteParamsSchema } from "@/lib/businessModules/officialMedicalService/components/procedures/details/OfficialMedicalServiceDetailsRouteParamsSchema";
import { AssessmentsTable } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/AssessmentsTable";

export default async function OfficialMedicalServiceAssessmentsPage(
  props: DynamicPageProps<OfficialMedicalServiceDetailsRouteParamsSchema>,
) {
  const { id } = await props.params;

  return <AssessmentsTable procedureId={id} />;
}
