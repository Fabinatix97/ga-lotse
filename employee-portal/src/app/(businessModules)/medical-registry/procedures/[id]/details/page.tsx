/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MedicalRegistryProcedurePageParams } from "@/app/(businessModules)/medical-registry/procedures/[id]/page";
import { MedicalRegistryProcedureDetails } from "@/lib/businessModules/medicalRegistry/components/procedures/details/MedicalRegistryProcedureDetails";

export default function MedicalRegistryProcedureDetailsPage({
  params,
}: Readonly<{ params: MedicalRegistryProcedurePageParams }>) {
  return <MedicalRegistryProcedureDetails procedureId={params.id} />;
}
