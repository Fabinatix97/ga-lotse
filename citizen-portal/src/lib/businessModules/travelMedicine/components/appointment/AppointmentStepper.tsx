/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";

import { usePostCitizenVaccinationConsultation } from "@/lib/businessModules/travelMedicine/api/mutations/citizenPublicApi";
import { initialValues } from "@/lib/businessModules/travelMedicine/components/appointment/appointmentFormValuesFactory";
import { AppointmentTypeStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/AppointmentTypeStep";
import { PersonalDataStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/PersonalDataStep";
import { TravelDataStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/TravelDataStep";
import { TravelTypeStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/TravelTypeStep";
import { VaccinationStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/VaccinationStep";
import { AppointmentReviewStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentReviewFormStep/AppointmentReviewStep";
import { AppointmentSlotStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/AppointmentSlotStep";
import { AppointmentOverview } from "@/lib/businessModules/travelMedicine/components/appointment/steps/overview/AppointmentOverview";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { MultiStepFormTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/multiStepForm/MultiStepFormWrapper";
import { DepartmentContextProvider } from "@/lib/businessModules/travelMedicine/components/shared/contexts/DepartmentContext";
import { StepContextProvider } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";
import { mapToApiPostCitizenVaccinationConsultationRequest } from "@/lib/businessModules/travelMedicine/helpers/appointmentFormHelper";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

export const StepKey = {
  AppointmentTypeStep: "AppointmentTypeStep",
  AppointmentSlotStep: "AppointmentSlotStep",
  TravelTypeStep: "TravelTypeStep",
  TravelDataStep: "TravelDataStep",
  PersonalDataStep: "PersonalDataStep",
  VaccinationStep: "VaccinationStep",
  AppointmentReviewStep: "AppointmentReviewStep",
} as const;
export type StepKey = (typeof StepKey)[keyof typeof StepKey];

const appointmentFormSteps = [
  <AppointmentTypeStep key={StepKey.AppointmentTypeStep} />,
  <AppointmentSlotStep key={StepKey.AppointmentSlotStep} />,
  <TravelTypeStep key={StepKey.TravelTypeStep} />,
  <TravelDataStep key={StepKey.TravelDataStep} />,
  <PersonalDataStep key={StepKey.PersonalDataStep} />,
  <VaccinationStep key={StepKey.VaccinationStep} />,
  <AppointmentReviewStep key={StepKey.AppointmentReviewStep} />,
];

export function AppointmentStepper() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const postCitizenVaccinationConsultation =
    usePostCitizenVaccinationConsultation();
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();

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
      <StepContextProvider steps={appointmentFormSteps}>
        {({ currentNode, currentStepIndex, totalSteps, isLastStep }) => (
          <>
            <MultiStepFormTitle
              title={t("common.title")}
              stepperTitle={t("common.stepperTitle", {
                currentStepIndex: currentStepIndex,
                totalSteps: totalSteps,
              })}
              withLogoutButton={false}
            />
            <Formik
              initialValues={initialValues}
              onSubmit={(values, helpers) => handleSubmit(values, helpers)}
            >
              <FormPlus>
                {!isLastStep ? (
                  <TwoColumnGrid
                    content={currentNode}
                    sidePanel={<AppointmentOverview />}
                  />
                ) : (
                  currentNode
                )}
              </FormPlus>
            </Formik>
          </>
        )}
      </StepContextProvider>
    </DepartmentContextProvider>
  );
}
