/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { FormProps } from "@eshg/lib-portal/types/form";
import { MutationBundle } from "@eshg/lib-portal/types/query";
import { PatchAnamnesisRequest } from "@eshg/official-medical-service-api";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { memo } from "react";

import { theme } from "@/lib/baseModule/theme/theme";
import { AffectedPersonSection } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/AffectedPersonSection";
import { AnamnesisButtonBar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/AnamnesisButtonBar";
import { AnamnesisFormValues } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/AnamnesisForm.config";
import { CurrentHealthConditionSection } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/CurrentHealthConditionSection";
import { HealthFitnessAndDisabilitySection } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/HealthFitnessAndDisabilitySection";
import { MedicalHistorySection } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/MedicalHistorySection";
import { RetirementSection } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/RetirementSection";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";

interface AnamnesisFormProps extends FormProps<AnamnesisFormValues> {
  valuesToMutationBundle: (
    values: AnamnesisFormValues,
  ) => MutationBundle<PatchAnamnesisRequest>;
}

export function AnamnesisForm({
  initialValues,
  onSubmit,
  ...props
}: AnamnesisFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values }) => (
        <FormPlus>
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={props.valuesToMutationBundle(values)}
          />
          <MemoizedAnamnesisFormStack />
          <AnamnesisButtonBar />
        </FormPlus>
      )}
    </Formik>
  );
}

const MemoizedAnamnesisFormStack = memo(InnerAnamnesisFormStack);
function InnerAnamnesisFormStack() {
  return (
    <Stack direction="column" gap={3} sx={{ m: theme.spacing(3) }}>
      <AffectedPersonSection />
      <HealthFitnessAndDisabilitySection />
      <RetirementSection />
      <MedicalHistorySection />
      <CurrentHealthConditionSection />
    </Stack>
  );
}
