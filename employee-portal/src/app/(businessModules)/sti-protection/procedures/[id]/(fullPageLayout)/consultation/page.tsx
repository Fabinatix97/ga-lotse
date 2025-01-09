/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { useSuspenseQueries } from "@tanstack/react-query";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { useConsultationQueryOptions } from "@/lib/businessModules/stiProtection/api/queries/consultation";
import { useStiProcedureQueryOptions } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { ConsultationForm } from "@/lib/businessModules/stiProtection/features/procedures/consultation/ConsultationForm";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

export default function ConsultationPage({
  params: { id: procedureId },
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  const [procedureQuery, consultationQuery] = useSuspenseQueries({
    queries: [
      useStiProcedureQueryOptions(procedureId),
      useConsultationQueryOptions(procedureId),
    ],
  });
  const { data: procedure } = procedureQuery;
  const { data: consultation } = consultationQuery;
  const isOpen = isProcedureOpen(procedure);

  return (
    <DisabledFormProvider disabled={!isOpen}>
      <ConsultationForm procedure={procedure} consultation={consultation} />
    </DisabledFormProvider>
  );
}
