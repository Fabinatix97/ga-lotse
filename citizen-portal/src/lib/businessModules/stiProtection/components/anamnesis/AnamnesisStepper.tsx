/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik, FormikProps } from "formik";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { useUpsertMedicalHistory } from "@/lib/businessModules/stiProtection/api/mutations/citizenApi";
import { useGetProcedure } from "@/lib/businessModules/stiProtection/api/queries/citizenApi";
import { FormDataProvider } from "@/lib/businessModules/stiProtection/components/appointment/AppointmentDataContext";
import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { StepContextProvider } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

import { AnamnesisStepLayout, AnamnesisTitle } from "./AnamnesisLayout";
import {
  FormDataWithoutConcern,
  defaultAnamnesisFormValues,
} from "./AnamnesisStepper.config";
import { GeneralStep } from "./Steps/GeneralStep";
import { PreventionStep } from "./Steps/PreventionStep";
import { PreviousIllnessesStep } from "./Steps/PreviousIllnessesStep";
import { mapFormValuesToApi } from "./helpers";

const INITIAL_VALUES: FormDataWithoutConcern = defaultAnamnesisFormValues();

export const StepKey = {
  GeneralStep: "GeneralStep",
  PreviousIllnessesStep: "PreviousIllnessesStep",
  PreventionStep: "PreventionStep",
} as const;
export type StepKey = (typeof StepKey)[keyof typeof StepKey];

const steps = [
  <GeneralStep key={StepKey.GeneralStep} />,
  <PreviousIllnessesStep key={StepKey.PreviousIllnessesStep} />,
  <PreventionStep key={StepKey.PreventionStep} />,
];

export function AnamnesisStepper() {
  const {
    data: { concern },
  } = useGetProcedure();
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  const anamnesisFormRef = useRef<FormikProps<FormDataWithoutConcern>>(null);

  const upsertMedicalHistory = useUpsertMedicalHistory();

  async function handleSubmit(values: FormDataWithoutConcern) {
    await upsertMedicalHistory.mutateAsync(
      mapFormValuesToApi({ concern, formValues: values }),
      {
        onSuccess: () => {
          router.push(citizenRoutes.appointments.index(accessCode));
        },
      },
    );
    router.push(citizenRoutes.appointments.index(accessCode));
  }

  return (
    <FormDataProvider initialData={{ concern }}>
      <StepContextProvider steps={steps}>
        {({ currentNode }) => (
          <>
            <AnamnesisTitle />
            <Formik
              initialValues={INITIAL_VALUES}
              onSubmit={handleSubmit}
              innerRef={anamnesisFormRef}
            >
              <AnamnesisStepLayout>{currentNode}</AnamnesisStepLayout>
            </Formik>
          </>
        )}
      </StepContextProvider>
    </FormDataProvider>
  );
}
