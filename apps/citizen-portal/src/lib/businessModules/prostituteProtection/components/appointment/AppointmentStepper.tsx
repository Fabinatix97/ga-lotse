/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useId, useState } from "react";

import {
  FormPlus,
  MultiStepForm,
  OptionalFieldValue,
  StepFactory,
  YesOrNoFieldData,
} from "@eshg/lib-portal";
import {
  ApiAppointment,
  type ApiCreateCitizenProcedureRequest,
  ApiPersonLanguage,
  ApiProstituteProtectionProcedureType,
} from "@eshg/prostitute-protection-api";

import { useBookAppointment } from "@/lib/businessModules/prostituteProtection/api/mutations/publicCitizenApi";
import { AppointmentOverview } from "@/lib/businessModules/prostituteProtection/components/appointment/AppointmentOverview";
import { AppointmentSummary } from "@/lib/businessModules/prostituteProtection/components/appointment/AppointmentSummary";
import { AppointmentTitle } from "@/lib/businessModules/prostituteProtection/components/appointment/AppointmentTitle";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

import { PersonalDataStep } from "./PersonalDataStep";
import { TimeSlotStep } from "./TimeSlotStep";

export interface AppointmentFormData {
  appointment?: ApiAppointment | null;
  procedureType: OptionalFieldValue<ApiProstituteProtectionProcedureType>;
  hasSufficientGermanLanguageSkills?: YesOrNoFieldData;
  otherKnownLanguages?: ApiPersonLanguage[];
  alias: string;
}

const STEPS: StepFactory<AppointmentFormData>[] = [
  PersonalDataStep,
  TimeSlotStep,
] as const;
export const initialData: AppointmentFormData = {
  alias: "",
  procedureType: "",
  hasSufficientGermanLanguageSkills: null,
  otherKnownLanguages: [],
  appointment: null,
};

export function AppointmentStepper() {
  const [formData, setFormData] = useState<AppointmentFormData>();
  const bookAppointment = useBookAppointment();

  async function handleSubmit(data: AppointmentFormData) {
    await bookAppointment.mutateAsync(mapToCreateProcedure(data));
    setFormData(data);
  }

  const titleId = useId();
  const stepTitleId = useId();
  return (
    <Stack>
      {formData ? (
        <AppointmentSummary
          values={formData}
          resetValues={() => setFormData(undefined)}
        />
      ) : (
        <MultiStepForm<AppointmentFormData> steps={STEPS}>
          {({ Outlet, currentStep, totalSteps }) => (
            <Formik initialValues={initialData} onSubmit={handleSubmit}>
              {(formikProps) => (
                <FormPlus
                  autoFocus
                  aria-labelledby={titleId}
                  aria-describedby={stepTitleId}
                >
                  <Stack gap={3}>
                    <AppointmentTitle
                      titleId={titleId}
                      stepTitleId={stepTitleId}
                      currentStepIndex={currentStep}
                      totalSteps={totalSteps}
                    />
                    <TwoColumnGrid
                      content={<Outlet {...formikProps} />}
                      sidePanel={<AppointmentOverview />}
                    />
                  </Stack>
                </FormPlus>
              )}
            </Formik>
          )}
        </MultiStepForm>
      )}
    </Stack>
  );
}

function mapToCreateProcedure({
  appointment,
  alias,
  hasSufficientGermanLanguageSkills,
  otherKnownLanguages,
  procedureType,
}: AppointmentFormData): ApiCreateCitizenProcedureRequest {
  if (!appointment) {
    throw new Error("appointment required");
  }

  if (!procedureType) {
    throw new Error("Procedure type required");
  }

  let languages: ApiPersonLanguage[];
  if (hasSufficientGermanLanguageSkills === "no") {
    if (!otherKnownLanguages) {
      throw new Error("Languages are required");
    }
    languages = otherKnownLanguages;
  } else {
    languages = [ApiPersonLanguage.German];
  }

  return {
    languages,
    appointment,
    alias,
    procedureType,
  };
}
