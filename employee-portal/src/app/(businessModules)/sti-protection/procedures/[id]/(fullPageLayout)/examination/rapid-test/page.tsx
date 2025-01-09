/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { useGetRapidTestExaminationQuery } from "@/lib/businessModules/stiProtection/api/queries/examination";
import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { RapidTestExamination } from "@/lib/businessModules/stiProtection/features/procedures/examination/rapidTest/RapidTestExamination";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function StiProtectionProcedureRapidTestPage({
  params: { id: procedureId },
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  const { data: procedure } = useStiProcedureQuery(procedureId);
  const isOpen = isProcedureOpen(procedure);
  const { data: rapidTestExamination } =
    useGetRapidTestExaminationQuery(procedureId);

  return (
    <DisabledFormProvider disabled={!isOpen}>
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        <RapidTestExamination
          procedureId={procedureId}
          rapidTestExamination={rapidTestExamination}
        />
      </MainContentLayout>
    </DisabledFormProvider>
  );
}
