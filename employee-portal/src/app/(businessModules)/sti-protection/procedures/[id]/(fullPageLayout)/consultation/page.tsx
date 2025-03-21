/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { StiProtectionProcedureRouteParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { useConsultationQueryOptions } from "@/lib/businessModules/stiProtection/api/queries/consultation";
import { useStiProcedureQueryOptions } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { ConsultationForm } from "@/lib/businessModules/stiProtection/features/procedures/consultation/ConsultationForm";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

export default function ConsultationPage(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = use(props.params);
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
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        <ConsultationForm procedure={procedure} consultation={consultation} />
      </MainContentLayout>
    </DisabledFormProvider>
  );
}
