/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import {
  MultiStepForm,
  StepFactory,
} from "@eshg/lib-portal/components/form/MultiStepForm";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, createContext, useState } from "react";

import { usePostCitizenVaccinationConsultation } from "@/lib/businessModules/travelMedicine/api/mutations/citizenPublicApi";
import { initialValues } from "@/lib/businessModules/travelMedicine/components/appointment/appointmentFormValuesFactory";
import { AppointmentTypeStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/AppointmentTypeStep";
import { PersonalDataStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/PersonalDataStep";
import { TravelDataStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/TravelDataStep";
import { TravelTypeStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/TravelTypeStep";
import { VaccinationStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/VaccinationStep";
import { AppointmentReviewStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentReviewFormStep/AppointmentReviewStep";
import { AppointmentContent } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/AppointmentContent";
import { AppointmentOverview } from "@/lib/businessModules/travelMedicine/components/appointment/steps/overview/AppointmentOverview";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { MultiStepFormTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/multiStepForm/MultiStepFormWrapper";
import { DepartmentContextProvider } from "@/lib/businessModules/travelMedicine/components/shared/contexts/DepartmentContext";
import { mapToApiPostCitizenVaccinationConsultationRequest } from "@/lib/businessModules/travelMedicine/helpers/appointmentFormHelper";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

export const AppointmentFormStep = {
  AppointmentTypeStep: 1,
  AppointmentSlotStep: 2,
  TravelTypeStep: 3,
  TravelDataStep: 4,
  PersonalDataStep: 5,
  VaccinationStep: 6,
  AppointmentReviewStep: 7,
} as const;
export type AppointmentFormStep =
  (typeof AppointmentFormStep)[keyof typeof AppointmentFormStep];

const STEPS: StepFactory<InitialAppointmentFormValues>[] = [
  AppointmentTypeStep,
  AppointmentContent,
  TravelTypeStep,
  TravelDataStep,
  PersonalDataStep,
  VaccinationStep,
  AppointmentReviewStep,
];

export const AppointmentStepperContext = createContext<{
  showSidepanel: boolean;
  setShowSidepanel: Dispatch<SetStateAction<boolean>>;
}>({
  showSidepanel: true,
  setShowSidepanel: () => {
    throw new Error("AppointmentStepperContext not initialized");
  },
});

export function AppointmentStepper() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const postCitizenVaccinationConsultation =
    usePostCitizenVaccinationConsultation();
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const [showSidepanel, setShowSidepanel] = useState(true);

  async function handleSubmit(
    values: InitialAppointmentFormValues,
    helpers: FormikHelpers<InitialAppointmentFormValues>,
  ) {
    const request = mapToApiPostCitizenVaccinationConsultationRequest(values);
    await postCitizenVaccinationConsultation.mutateAsync(request, {
      onSuccess: () => {
        helpers.resetForm();
        // change when successPage is present
        router.push(citizenRoutes.overview);
      },
    });
  }

  return (
    <DepartmentContextProvider>
      <AppointmentStepperContext value={{ showSidepanel, setShowSidepanel }}>
        <MultiStepForm<InitialAppointmentFormValues> steps={STEPS}>
          {({ Outlet, currentStep, totalSteps }) => (
            <>
              <MultiStepFormTitle
                title={t("common.title")}
                stepperTitle={t("common.stepperTitle", {
                  currentStepIndex: currentStep,
                  totalSteps: totalSteps,
                })}
                withLogoutButton={false}
              />
              <Formik
                initialValues={initialValues}
                onSubmit={(values, helpers) => handleSubmit(values, helpers)}
              >
                {(formikProps) => (
                  <FormPlus>
                    {currentStep !== totalSteps && showSidepanel ? (
                      <TwoColumnGrid
                        content={<Outlet {...formikProps} />}
                        sidePanel={<AppointmentOverview />}
                      />
                    ) : (
                      <Outlet {...formikProps} />
                    )}
                  </FormPlus>
                )}
              </Formik>
            </>
          )}
        </MultiStepForm>
      </AppointmentStepperContext>
    </DepartmentContextProvider>
  );
}
