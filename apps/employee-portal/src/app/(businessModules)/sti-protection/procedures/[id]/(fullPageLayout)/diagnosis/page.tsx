/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { DisabledFormProvider, DynamicPageProps } from "@eshg/lib-portal";

import { useDiagnosisQueryOptions } from "@/lib/businessModules/stiProtection/api/queries/diagnosis";
import { useStiProcedureQueryOptions } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { StiProtectionProcedureRouteParams } from "@/lib/businessModules/stiProtection/features/procedures/StiProtectionProcedureRouteParams";
import { DiagnosisForm } from "@/lib/businessModules/stiProtection/features/procedures/diagnosis/DiagnosisForm";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

export default function StiProtectionProcedureDiagnosisPage(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = use(props.params);
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
