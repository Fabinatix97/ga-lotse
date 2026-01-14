/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { memo } from "react";

import { ConfirmLeaveDirtyFormEffect } from "@eshg/lib-employee-portal";
import { FormPlus, FormProps, MutationBundle } from "@eshg/lib-portal";
import {
  AffectedPersonSection,
  AnamnesisFormValues,
  CurrentHealthConditionSection,
  HealthFitnessAndDisabilitySection,
  MedicalHistorySection,
  RetirementSection,
} from "@eshg/official-medical-service";
import { PatchAnamnesisRequest } from "@eshg/official-medical-service-api";

import { theme } from "@/lib/baseModule/theme/theme";
import { AnamnesisButtonBar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/AnamnesisButtonBar";

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
