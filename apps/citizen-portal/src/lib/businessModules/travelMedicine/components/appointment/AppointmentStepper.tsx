/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik, FormikHelpers } from "formik";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useId,
  useMemo,
  useState,
} from "react";

import {
  FormPlus,
  MultiStepForm,
  StepFactory,
  getCloseable,
  getErrorAction,
  getErrorDescription,
  resolveError,
  useAlert,
} from "@eshg/lib-portal";

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
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

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

interface AppointmentStepperContextValue {
  showSidepanel: boolean;
  setShowSidepanel: Dispatch<SetStateAction<boolean>>;
}

export const AppointmentStepperContext =
  createContext<AppointmentStepperContextValue>({
    showSidepanel: true,
    setShowSidepanel: () => {
      throw new Error("AppointmentStepperContext not initialized");
    },
  });

export function AppointmentStepper() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const postCitizenVaccinationConsultation =
    usePostCitizenVaccinationConsultation();
  const router = useScopedRouter();
  const citizenRoutes = useCitizenRoutes();
  const [showSidepanel, setShowSidepanel] = useState(true);
  const alert = useAlert();

  async function handleSubmit(
    values: InitialAppointmentFormValues,
    helpers: FormikHelpers<InitialAppointmentFormValues>,
    setStep: (index: number) => void,
  ) {
    const request = mapToApiPostCitizenVaccinationConsultationRequest(values);
    await postCitizenVaccinationConsultation.mutateAsync(request, {
      onSuccess: () => {
        helpers.resetForm();
        // change when successPage is present
        router.push(citizenRoutes.overview);
      },
      onError: (error) => {
        if (
          error instanceof Error &&
          error.message.startsWith("The requested time slot does not")
        ) {
          alert.error({
            message: t("common.errors.concurrentAppointment", {
              context: "errorMessage",
            }),
            action: {
              text: t("common.errors.concurrentAppointment", {
                context: "action",
              }),
              onClick: () => setStep(STEPS.indexOf(AppointmentContent) + 1),
            },
          });
        } else {
          const { errorCode } = resolveError(error);
          const { title, message } = getErrorDescription(errorCode);

          alert.error({
            title,
            message,
            action: getErrorAction(errorCode),
            closeable: getCloseable(errorCode),
          });
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  }

  const contextValue = useMemo<AppointmentStepperContextValue>(
    () => ({ showSidepanel, setShowSidepanel }),
    [showSidepanel, setShowSidepanel],
  );

  const titleId = useId();
  const stepperTitleId = useId();
  return (
    <DepartmentContextProvider>
      <AppointmentStepperContext value={contextValue}>
        <MultiStepForm<InitialAppointmentFormValues> steps={STEPS}>
          {({ Outlet, currentStep, totalSteps, setStep, titleRef }) => (
            <>
              <MultiStepFormTitle
                titleRef={titleRef}
                title={t("common.title")}
                titleId={titleId}
                stepperTitleId={stepperTitleId}
                stepperTitle={t("common.stepperTitle", {
                  currentStepIndex: currentStep,
                  totalSteps: totalSteps,
                })}
                withLogoutButton={false}
              />
              <Formik
                initialValues={initialValues}
                validate={alert.close}
                onSubmit={(values, helpers) =>
                  handleSubmit(values, helpers, setStep)
                }
              >
                {(formikProps) => (
                  <FormPlus
                    aria-labelledby={titleId}
                    aria-describedby={stepperTitleId}
                  >
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
