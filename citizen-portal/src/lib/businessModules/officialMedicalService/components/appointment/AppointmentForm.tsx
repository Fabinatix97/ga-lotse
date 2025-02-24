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
  ApiSalutation,
  ApiTitle,
  PostCitizenProcedureRequest,
} from "@eshg/official-medical-service-api";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { usePostCitizenProcedure } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenPublicApi";
import { AppointmentFormSidePanel } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentFormSidePanel";
import { AppointmentStepWrapper } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentStepWrapper";
import { ConcernStep } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/ConcernStep";
import { DocumentAndPersonalDataStep } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/DocumentAndPersonalDataStep";
import { SummaryStep } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/SummaryStep";
import { DepartmentContextProvider } from "@/lib/businessModules/officialMedicalService/shared/contexts/DepartmentContext";
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
  concern: string;
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
  concern: "",
  affectedPerson: {
    salutation: "",
    title: "",
    firstName: "",
    lastName: "",
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

  async function handleSubmit(values: AppointmentFormValues) {
    const request: PostCitizenProcedureRequest =
      mapToPostCitizenProcedureRequest(values);

    await postCitizenProcedure.mutateAsync(request, {
      onSuccess: () => router.push(citizenRoutes.overview),
    });
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
                  {Outlet.name !== "AppointmentStepWrapper" ? (
                    <TwoColumnGrid
                      content={<Outlet {...formikProps} />}
                      sidePanel={<AppointmentFormSidePanel />}
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
