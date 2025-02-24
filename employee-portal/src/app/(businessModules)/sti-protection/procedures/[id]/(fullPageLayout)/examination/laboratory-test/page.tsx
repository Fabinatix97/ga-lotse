/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { useGetLaboratoryTestExaminationQuery } from "@/lib/businessModules/stiProtection/api/queries/examination";
import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { LaboratoryTestExamination } from "@/lib/businessModules/stiProtection/features/procedures/examination/laboratoryTest/LaboratoryTestExamination";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

export default function StiProtectionProcedureLaboratoryTestPage({
  params: { id: procedureId },
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  const { data: procedure } = useStiProcedureQuery(procedureId);
  const isOpen = isProcedureOpen(procedure);
  const { data: laboratoryTestExamination } =
    useGetLaboratoryTestExaminationQuery(procedureId);

  return (
    <DisabledFormProvider disabled={!isOpen}>
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        <LaboratoryTestExamination
          procedureId={procedureId}
          laboratoryTestExamination={laboratoryTestExamination}
        />
      </MainContentLayout>
    </DisabledFormProvider>
  );
}
