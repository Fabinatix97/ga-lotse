/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import {
  MultiStepForm,
  StepFactory,
} from "@eshg/lib-portal/components/form/MultiStepForm";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import {
  ApiAppointment,
  ApiAppointmentType,
  ApiConcern,
  ApiSalutation,
  ApiTitle,
  PostCitizenProcedureRequest,
} from "@eshg/official-medical-service-api";
import { useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { useCitizenPublicApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { usePostCitizenProcedure } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenPublicApi";
import { validateFiles } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
import { AppointmentFormSidePanel } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentFormSidePanel";
import { AppointmentStepWrapper } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentStepWrapper";
import { ConcernStep } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/ConcernStep";
import { DocumentAndPersonalDataStep } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/DocumentAndPersonalDataStep";
import { SummaryStep } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/SummaryStep";
import { DepartmentContextProvider } from "@/lib/businessModules/officialMedicalService/shared/contexts/DepartmentContext";
import { mapToFrontendErrorMessage } from "@/lib/businessModules/officialMedicalService/shared/file/helpers";
import { mapToPostCitizenProcedureRequest } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { useCitizenRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { MultiStepFormTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/multiStepForm/MultiStepFormWrapper";
import { useTranslation } from "@/lib/i18n/client";
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
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const postCitizenProcedure = usePostCitizenProcedure();
  const citizenPublicApi = useCitizenPublicApi();
  const queryClient = useQueryClient();

  async function handleSubmit(values: AppointmentFormValues) {
    const request: PostCitizenProcedureRequest =
      mapToPostCitizenProcedureRequest(values);

    await postCitizenProcedure.mutateAsync(request, {
      onSuccess: () => router.push(citizenRoutes.overview),
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
            fieldError += mapToFrontendErrorMessage(t, errorMessage) + "\n";
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
        {({ Outlet, currentStep, totalSteps }) => (
          <>
            <MultiStepFormTitle
              title={t("common.title")}
              stepperTitle={t("common.stepTitle", {
                currentStepIndex: currentStep,
                totalSteps: totalSteps,
              })}
              withLogoutButton={false}
            />
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
              {(formikProps) => (
                <FormPlus>
                  {currentStep !== STEPS.indexOf(AppointmentStepWrapper) + 1 ? (
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
          </>
        )}
      </MultiStepForm>
    </DepartmentContextProvider>
  );
}
