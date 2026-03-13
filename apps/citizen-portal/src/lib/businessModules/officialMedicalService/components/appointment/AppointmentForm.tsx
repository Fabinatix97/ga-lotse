/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EventAvailableOutlined } from "@mui/icons-material";
import { Formik, FormikHelpers, FormikProps, useFormikContext } from "formik";
import { FunctionComponent, PropsWithChildren } from "react";
import { when } from "remeda";

import {
  FormPlus,
  MultiStepForm,
  OptionalFieldValue,
  StepFactory,
  isNonEmptyString,
  useMultiStepForm,
} from "@eshg/lib-portal";
import {
  ApiAppointment,
  ApiAppointmentType,
  ApiConcern,
  ApiSalutation,
  ApiTitle,
} from "@eshg/official-medical-service-api";

import { useHandleConcurrentAppointment } from "@/lib/businessModules/officialMedicalService/api/helpers";
import { usePostCitizenProcedure } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenPublicApi";
import { useBackendFileValidation } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";
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
    standardDurationInMinutes: OptionalFieldValue<number>;
  };
  appointment?: ApiAppointment;
  confirmOnlineServices: boolean;
  confirmPrivacyNotice: boolean;
  confirmPrivacyPolicy: boolean;
}

const AppointmentStepFactory: StepFactory<AppointmentFormValues>[] = [
  () => <ConcernStep />,
  AppointmentStepWrapper,
  DocumentAndPersonalDataStep,
  SummaryStep,
];

const AppointmentStep = {
  Concern: 1,
  Appointment: 2,
  DocumentAndPersonalData: 3,
  Summary: 4,
} as const;

const INITIAL_VALUES: AppointmentFormValues = {
  concern: {
    index: "",
    standardDurationInMinutes: "",
    appointmentType: "",
    categoryNames: {
      GERMAN: "",
      ENGLISH: "",
    },
    highPriority: false,
    names: {
      GERMAN: "",
      ENGLISH: "",
    },
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

  return (
    <DepartmentContextProvider>
      <MultiStepForm<AppointmentFormValues> steps={AppointmentStepFactory}>
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
            <StepperInner Outlet={Outlet} />
          </>
        )}
      </MultiStepForm>
    </DepartmentContextProvider>
  );
}

function StepperInner({
  Outlet,
}: Readonly<{
  Outlet: FunctionComponent<FormikProps<AppointmentFormValues>>;
}>) {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
  const { setStep } = useMultiStepForm();
  const citizenRoutes = useCitizenRoutes();
  const postCitizenProcedure = usePostCitizenProcedure();
  const handleConcurrentAppointments = useHandleConcurrentAppointment();

  async function handleSubmit(
    values: AppointmentFormValues,
    helpers: FormikHelpers<AppointmentFormValues>,
  ) {
    const request = mapToPostCitizenProcedureRequest(values);

    await postCitizenProcedure.mutateAsync(request, {
      onError: handleConcurrentAppointments({
        message: t("common.errors.concurrentAppointment", {
          context: "errorMessage",
        }),
        action: {
          text: t("common.errors.concurrentAppointment", {
            context: "action",
          }),
          onClick: () => {
            setStep(AppointmentStep.Appointment);
            void helpers.setFieldValue("appointment", undefined);
          },
        },
      }),
    });
  }

  if (postCitizenProcedure.isSuccess) {
    return (
      <FormSuccessSheet
        icon={EventAvailableOutlined}
        title={t("success.title")}
        description={t("success.description")}
        buttonLabel={t("success.buttonLabel")}
        buttonHref={citizenRoutes.overview}
      />
    );
  }

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {(formikProps) => (
        <FormPlus autoFocus aria-label={t("common.title")}>
          <FormInner>
            <Outlet {...formikProps} />
          </FormInner>
        </FormPlus>
      )}
    </Formik>
  );
}

function FormInner({ children }: Readonly<PropsWithChildren>) {
  const { currentStep } = useMultiStepForm();
  const { setFieldError } = useFormikContext<AppointmentFormValues>();
  const validateFiles = useBackendFileValidation();
  const mapErrorMessage = useMapToFrontendErrorMessage();

  // The Appointment Step does its own TwoColumnGrid because it displays
  //  a fullscreen warning when no appointments are available
  if (currentStep === AppointmentStep.Appointment) {
    return children;
  }

  async function backendValidation(values: AppointmentFormValues) {
    if (currentStep !== AppointmentStep.DocumentAndPersonalData) {
      return true;
    }

    const { errorMessages } = await validateFiles(values.files);

    if (!errorMessages.some(isNonEmptyString)) {
      return true;
    }

    errorMessages
      .map(
        when(isNonEmptyString, {
          onTrue: mapErrorMessage,
          onFalse: () => undefined,
        }),
      )
      .forEach((message, index) => {
        setFieldError(`files[${index}]`, message);
      });

    return false;
  }

  return (
    <TwoColumnGrid
      content={children}
      sidePanel={
        <AppointmentFormSidePanel backendValidation={backendValidation} />
      }
    />
  );
}
