/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { DisabledFormProvider, DynamicPageProps } from "@eshg/lib-portal";

import { StiProtectionProcedureRouteParams } from "@/app/(businessModules)/sti-protection/procedures/[id]/(fullPageLayout)/layout";
import { useMedicalHistoryQuery } from "@/lib/businessModules/stiProtection/api/queries/medicalHistory";
import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { MedicalHistoryForm } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";

export default function StiProtectionProcedureAnamnesisPage(
  props: DynamicPageProps<StiProtectionProcedureRouteParams>,
) {
  const { id: procedureId } = use(props.params);
  const { data: procedure } = useStiProcedureQuery(procedureId);
  const isOpen = isProcedureOpen(procedure);
  const { data: medicalHistory } = useMedicalHistoryQuery(procedureId);

  return (
    <DisabledFormProvider disabled={!isOpen}>
      <MainContentLayout sx={{ margin: 0, padding: 0 }} fullViewportHeight>
        <MedicalHistoryForm
          procedure={procedure}
          medicalHistory={medicalHistory}
        />
      </MainContentLayout>
    </DisabledFormProvider>
  );
}
