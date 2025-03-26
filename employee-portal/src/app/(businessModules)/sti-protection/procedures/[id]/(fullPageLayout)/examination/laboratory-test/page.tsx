/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { use } from "react";

import { StiProtectionProcedureRouteParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { useGetLaboratoryTestExaminationQuery } from "@/lib/businessModules/stiProtection/api/queries/examination";
import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { LaboratoryTestExamination } from "@/lib/businessModules/stiProtection/features/procedures/examination/laboratoryTest/LaboratoryTestExamination";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

export default function StiProtectionProcedureLaboratoryTestPage(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = use(props.params);
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
          labStatus={procedure.labStatus}
        />
      </MainContentLayout>
    </DisabledFormProvider>
  );
}
