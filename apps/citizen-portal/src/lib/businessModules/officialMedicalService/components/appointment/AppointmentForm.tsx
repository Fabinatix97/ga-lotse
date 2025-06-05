/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EventAvailableOutlined } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";

import {
  FormPlus,
  MultiStepForm,
  OptionalFieldValue,
  StepFactory,
  getCloseable,
  getErrorAction,
  getErrorDescription,
  resolveError,
  useAlert,
} from "@eshg/lib-portal";
import {
  ApiAppointment,
  ApiAppointmentType,
  ApiConcern,
  ApiSalutation,
  ApiTitle,
  PostCitizenProcedureRequest,
} from "@eshg/official-medical-service-api";

import { useCitizenPublicApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { usePostCitizenProcedure } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenPublicApi";
import { validateFiles } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { AppointmentFormSidePanel } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentFormSidePanel";
import { AppointmentStepWrapper } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentStepWrapper";
import { ConcernStep } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/ConcernStep";
import { DocumentAndPersonalDataStep } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/DocumentAndPersonalDataStep";
import { SummaryStep } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/SummaryStep";
import { DepartmentContextProvider } from "@/lib/businessModules/officialMedicalService/shared/contexts/DepartmentContext";
import { useMapToFrontendErrorMessage } from "@/lib/businessModules/officialMedicalService/shared/file/helpers";
import { mapToPostCitizenProcedureRequest } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { MultiStepFormTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/multiStepForm/MultiStepFormWrapper";
import { useTranslation } from "@/lib/i18n/client";
import { FormSuccessSheet } from "@/lib/shared/components/form/FormSuccessSheet";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

export interface AppointmentFormValues {
  files: File[];
  affectedPerson: {
    salutation: OptionalFieldValue<ApiSalutation>;
    title: OptionalFieldValue<ApiTitle>;
    firstName: string;
    lastName: string;
    nameAtBirth?: string;
    dateOfBirth: string;
    emailAddresses: string;
    phoneNumbers?: string;
    contactAddress: {
      street: string;
      houseNumber: string;
      addressAddition?: string;
      postalCode: string;
      city: string;
    };
  };
  concern: Omit<
    ApiConcern,
    "version" | "visibleInOnlinePortal" | "appointmentType"
  > & {
    index: string;
    appointmentType: OptionalFieldValue<ApiAppointmentType>;
    standardDurationInMinutes: string;
  };
  appointment?: ApiAppointment;
  confirmOnlineServices: boolean;
  confirmPrivacyNotice: boolean;
  confirmPrivacyPolicy: boolean;
}

const STEPS: StepFactory<AppointmentFormValues>[] = [
  () => <ConcernStep />,
  AppointmentStepWrapper,
  DocumentAndPersonalDataStep,
  SummaryStep,
];

const INITIAL_VALUES: AppointmentFormValues = {
  concern: {
    index: "",
    standardDurationInMinutes: "",
    appointmentType: "",
    categoryNameDe: "",
    categoryNameEn: "",
    highPriority: false,
    nameDe: "",
    nameEn: "",
  },
  affectedPerson: {
    salutation: "",
    title: "",
    firstName: "",
    lastName: "",
    nameAtBirth: "",
    dateOfBirth: "",
    emailAddresses: "",
    phoneNumbers: "",
    contactAddress: {
      street: "",
      houseNumber: "",
      addressAddition: "",
      postalCode: "",
      city: "",
    },
  },
  files: [],
  confirmOnlineServices: false,
  confirmPrivacyNotice: false,
  confirmPrivacyPolicy: false,
  appointment: undefined,
};

export function AppointmentForm() {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
  const citizenRoutes = useCitizenRoutes();
  const postCitizenProcedure = usePostCitizenProcedure();
  const citizenPublicApi = useCitizenPublicApi();
  const queryClient = useQueryClient();
  const alert = useAlert();
  const errorMessageMapping = useMapToFrontendErrorMessage();

  async function handleSubmit(
    values: AppointmentFormValues,
    setStep: (index: number) => void,
  ) {
    const request: PostCitizenProcedureRequest =
      mapToPostCitizenProcedureRequest(values);

    await postCitizenProcedure.mutateAsync(request, {
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
              onClick: () => setStep(STEPS.indexOf(AppointmentStepWrapper) + 1),
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

  async function backendValidation(
    currentStep: number,
    values: AppointmentFormValues,
    setFieldError: (field: string, message: string | undefined) => void,
  ) {
    if (currentStep === STEPS.indexOf(DocumentAndPersonalDataStep) + 1) {
      const serverValidationResponse = await validateFiles(
        citizenPublicApi,
        queryClient,
        values.files as Blob[],
      );
      if (serverValidationResponse.errorMessages.some((s) => s)) {
        let fieldError = "\n";
        for (const errorMessage of serverValidationResponse.errorMessages) {
          if (errorMessage) {
            fieldError += errorMessageMapping(errorMessage) + "\n";
          } else {
            fieldError += "\n";
          }
        }
        setFieldError("files", fieldError);

        return false;
      }
    }
    return true;
  }

  return (
    <DepartmentContextProvider>
      <MultiStepForm<AppointmentFormValues> steps={STEPS}>
        {({ Outlet, currentStep, totalSteps, setStep, titleRef }) => (
          <>
            <MultiStepFormTitle
              titleRef={titleRef}
              title={t("common.title")}
              stepperTitle={t("common.stepTitle", {
                currentStepIndex: currentStep,
                totalSteps: totalSteps,
              })}
              withLogoutButton={false}
            />
            {postCitizenProcedure.isSuccess ? (
              <FormSuccessSheet
                icon={EventAvailableOutlined}
                title={t("success.title")}
                description={t("success.description")}
                buttonLabel={t("success.buttonLabel")}
                buttonHref={citizenRoutes.overview}
              />
            ) : (
              <Formik
                initialValues={INITIAL_VALUES}
                validate={() => {
                  // validate gets triggered on blur, so we use it to clear our error alert
                  alert.close();
                }}
                onSubmit={(values) => handleSubmit(values, setStep)}
              >
                {(formikProps) => (
                  <FormPlus>
                    {currentStep !==
                    STEPS.indexOf(AppointmentStepWrapper) + 1 ? (
                      <TwoColumnGrid
                        content={<Outlet {...formikProps} />}
                        sidePanel={
                          <AppointmentFormSidePanel
                            backendValidation={backendValidation}
                          />
                        }
                      />
                    ) : (
                      <AppointmentStepWrapper />
                    )}
                  </FormPlus>
                )}
              </Formik>
            )}
          </>
        )}
      </MultiStepForm>
    </DepartmentContextProvider>
  );
}
