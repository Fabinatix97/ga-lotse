/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useId } from "react";

import {
  ApiApplicantAddress,
  ApiApplicantCategory,
  ApiAppointment,
  ApiInfectionBriefingAppointType,
  ApiPersonWithEmail,
  ApiSalutation,
} from "@eshg/infection-briefing-api";
import { FormPlus, MultiStepForm, StepFactory } from "@eshg/lib-portal";

import { useBookAppointment } from "@/lib/businessModules/infectionBriefing/api/mutations/publicCitizenApi";
import { AppointmentOverview } from "@/lib/businessModules/infectionBriefing/components/appointment/AppointmentOverview";
import { AppointmentTitle } from "@/lib/businessModules/infectionBriefing/components/appointment/AppointmentTitle";
import { AppointmentTypeStep } from "@/lib/businessModules/infectionBriefing/components/steps/AppointmentTypeStep";
import { PersonalDataStep } from "@/lib/businessModules/infectionBriefing/components/steps/PersonalDataStep";
import { SummaryStep } from "@/lib/businessModules/infectionBriefing/components/steps/SummaryStep";
import { TimeSlotStep } from "@/lib/businessModules/infectionBriefing/components/steps/TimeSlotStep";
import { useCitizenRoutes } from "@/lib/businessModules/infectionBriefing/shared/routes";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

export interface AppointmentFormData {
  affectedPerson: {
    salutation: ApiSalutation;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber?: string;
    email: string;
    confirmOnlineServices: boolean;
  };
  appointmentType: ApiInfectionBriefingAppointType | null;
  appointment?: ApiAppointment | null;
  isInfoModalOpen: boolean;
  infoModalTitle: string;
  confirmPrivacyNotice: boolean;
  confirmPrivacyPolicy: boolean;
  isCancelModalOpen: boolean;
}

export interface ApiCreateCitizenNewProcedureRequest {
  applicant: ApiPersonWithEmail;
  startTime: Date;
  applicantAddress?: ApiApplicantAddress;
  applicantCategory?: ApiApplicantCategory;
}

export interface ApiCreateCitizenDuplicateProcedureRequest {
  applicant: ApiPersonWithEmail;
  startTime: Date;
}

export type AppointmentRequest =
  | ApiCreateCitizenNewProcedureRequest
  | ApiCreateCitizenDuplicateProcedureRequest;

const STEPS: StepFactory<AppointmentFormData>[] = [
  AppointmentTypeStep,
  TimeSlotStep,
  PersonalDataStep,
  SummaryStep,
] as const;

export const initialData: AppointmentFormData = {
  affectedPerson: {
    salutation: ApiSalutation.NotSpecified,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    confirmOnlineServices: false,
  },
  appointmentType: null,
  appointment: null,
  isInfoModalOpen: false,
  infoModalTitle: "",
  confirmPrivacyNotice: false,
  confirmPrivacyPolicy: false,
  isCancelModalOpen: false,
};

export function AppointmentStepper() {
  const bookAppointment = useBookAppointment();
  const titleId = useId();
  const stepTitleId = useId();
  const router = useScopedRouter();
  const routes = useCitizenRoutes();
  const landingPageRoute = routes.overview;

  return (
    <Stack>
      <MultiStepForm<AppointmentFormData> steps={STEPS}>
        {({ Outlet, currentStep, totalSteps }) => (
          <Formik
            initialValues={initialData}
            onSubmit={async (values) => {
              let requestData: AppointmentRequest;
              let type: "NEW" | "DUPLICATE";

              if (values) {
                if (values.appointmentType === "INFECTION_BRIEFING_NEW") {
                  requestData =
                    createAppointmentMapper<ApiCreateCitizenNewProcedureRequest>(
                      values,
                    );
                  type = "NEW";
                } else {
                  requestData =
                    createAppointmentMapper<ApiCreateCitizenDuplicateProcedureRequest>(
                      values,
                    );
                  type = "DUPLICATE";
                }
                await bookAppointment.mutateAsync({ type, data: requestData });
                router.push(landingPageRoute);
              }
            }}
          >
            {(formikProps) => {
              return (
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
                    {currentStep < totalSteps ? (
                      <TwoColumnGrid
                        content={<Outlet {...formikProps} />}
                        sidePanel={<AppointmentOverview />}
                      />
                    ) : (
                      <SummaryStep />
                    )}
                  </Stack>
                </FormPlus>
              );
            }}
          </Formik>
        )}
      </MultiStepForm>
    </Stack>
  );
}

function createAppointmentMapper<T>(formData: AppointmentFormData): T {
  if (!formData.appointment) {
    throw new Error("appointment required");
  }
  if (!formData.affectedPerson) {
    throw new Error("Personal Data required");
  }

  return {
    applicant: {
      ...formData.affectedPerson,
      dateOfBirth: new Date(formData.affectedPerson.dateOfBirth),
    },
    startTime: new Date(formData.appointment.start),
  } as T;
}
