/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { memo } from "react";

import { AnamnesisFormValues } from "@eshg/lib-portal/businessModules/officialMedicalService/anamnesis/formConfig";
import { AffectedPersonSection } from "@eshg/lib-portal/businessModules/officialMedicalService/anamnesis/sections/AffectedPersonSection";
import { CurrentHealthConditionSection } from "@eshg/lib-portal/businessModules/officialMedicalService/anamnesis/sections/CurrentHealthConditionSection";
import { HealthFitnessAndDisabilitySection } from "@eshg/lib-portal/businessModules/officialMedicalService/anamnesis/sections/HealthFitnessAndDisabilitySection";
import { MedicalHistorySection } from "@eshg/lib-portal/businessModules/officialMedicalService/anamnesis/sections/MedicalHistorySection";
import { RetirementSection } from "@eshg/lib-portal/businessModules/officialMedicalService/anamnesis/sections/RetirementSection";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { FormProps } from "@eshg/lib-portal/types/form";
import { MutationBundle } from "@eshg/lib-portal/types/query";
import { PatchAnamnesisRequest } from "@eshg/official-medical-service-api";

import { theme } from "@/lib/baseModule/theme/theme";
import { AnamnesisButtonBar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/AnamnesisButtonBar";
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
      enableReinitialize
      onSubmit={onSubmit}
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
