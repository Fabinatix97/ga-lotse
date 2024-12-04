/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";

import { StiProtectionProcedurePageParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { Examinations } from "@/lib/businessModules/stiProtection/features/procedures/examination/Examinations";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

export default function StiProtectionProcedureExaminationPage({
  params: { id: procedureId },
}: Readonly<{
  params: StiProtectionProcedurePageParams;
}>) {
  const { data: procedure } = useStiProcedureQuery(procedureId);
  const isOpen = isProcedureOpen(procedure);

  return (
    <DisabledFormProvider disabled={!isOpen}>
      <Examinations procedureId={procedureId} />
    </DisabledFormProvider>
  );
}
