/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { useSuspenseQueries } from "@tanstack/react-query";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { useDiagnosisQueryOptions } from "@/lib/businessModules/stiProtection/api/queries/diagnosis";
import { useStiProcedureQueryOptions } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { DiagnosisForm } from "@/lib/businessModules/stiProtection/features/procedures/diagnosis/DiagnosisForm";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

export default function StiProtectionProcedureDiagnosisPage({
  params: { id: procedureId },
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  const [{ data: procedure }, { data: diagnosis }] = useSuspenseQueries({
    queries: [
      useStiProcedureQueryOptions(procedureId),
      useDiagnosisQueryOptions(procedureId),
    ],
  });
  const isOpen = isProcedureOpen(procedure);

  return (
    <DisabledFormProvider disabled={!isOpen}>
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        <DiagnosisForm procedure={procedure} diagnosis={diagnosis} />
      </MainContentLayout>
    </DisabledFormProvider>
  );
}
