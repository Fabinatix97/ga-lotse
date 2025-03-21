/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { MedicalRegistryProcedureRouteParams } from "@/app/(businessModules)/medical-registry/procedures/[id]/page";
import { MedicalRegistryProcedureDetails } from "@/lib/businessModules/medicalRegistry/components/procedures/details/MedicalRegistryProcedureDetails";

export default async function MedicalRegistryProcedureDetailsPage(
  props: DynamicPageProps<MedicalRegistryProcedureRouteParams>,
) {
  const { id } = await props.params;

  return <MedicalRegistryProcedureDetails procedureId={id} />;
}
