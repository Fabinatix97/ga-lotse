/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { useMedicalHistoryQuery } from "@/lib/businessModules/stiProtection/api/queries/medicalHistory";
import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { MedicalHistoryForm } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

export default function StiProtectionProcedureAnamnesisPage({
  params: { id: procedureId },
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  const { data: procedure } = useStiProcedureQuery(procedureId);
  const isOpen = isProcedureOpen(procedure);
  const { data: medicalHistory } = useMedicalHistoryQuery(procedureId);

  return (
    <DisabledFormProvider disabled={!isOpen}>
      <MedicalHistoryForm
        procedure={procedure}
        medicalHistory={medicalHistory}
      />
    </DisabledFormProvider>
  );
}
