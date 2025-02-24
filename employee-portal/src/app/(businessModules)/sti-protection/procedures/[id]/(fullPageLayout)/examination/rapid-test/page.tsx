/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { useSuspenseQueries } from "@tanstack/react-query";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { useGetRapidTestExaminationQueryOptions } from "@/lib/businessModules/stiProtection/api/queries/examination";
import { useStiProcedureQueryOptions } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { RapidTestExamination } from "@/lib/businessModules/stiProtection/features/procedures/examination/rapidTest/RapidTestExamination";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

export default function StiProtectionProcedureRapidTestPage({
  params: { id: procedureId },
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  const [{ data: procedure }, { data: rapidTestExamination }] =
    useSuspenseQueries({
      queries: [
        useStiProcedureQueryOptions(procedureId),
        useGetRapidTestExaminationQueryOptions(procedureId),
      ],
    });
  const isOpen = isProcedureOpen(procedure);

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
