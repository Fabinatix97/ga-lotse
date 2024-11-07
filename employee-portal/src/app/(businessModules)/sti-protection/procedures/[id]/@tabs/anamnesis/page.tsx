/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/layout";
import { useMedicalHistoryQuery } from "@/lib/businessModules/stiProtection/api/queries/medicalHistory";
import { MedicalHistoryForm } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm";

export default function StiProtectionProcedureAnamnesisPage({
  params: { id: procedureId },
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  const { data: medicalHistory } = useMedicalHistoryQuery(procedureId);

  return (
    <DisabledFormProvider disabled={!!medicalHistory}>
      <MedicalHistoryForm
        procedureId={procedureId}
        medicalHistory={medicalHistory}
      />
    </DisabledFormProvider>
  );
}
