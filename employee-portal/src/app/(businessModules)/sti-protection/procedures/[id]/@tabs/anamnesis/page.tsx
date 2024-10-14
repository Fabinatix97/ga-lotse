/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/layout";
import { MedicalHistoryForm } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm";

export default function StiProtectionProcedureAnamnesisPage({
  params,
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  return <MedicalHistoryForm procedureId={params.id} />;
}
