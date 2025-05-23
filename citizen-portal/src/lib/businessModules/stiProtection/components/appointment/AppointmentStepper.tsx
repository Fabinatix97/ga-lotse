/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGender } from "@eshg/base-api";
import { YesOrNoFieldData } from "@eshg/lib-portal";
import { ApiAppointment, ApiConcern } from "@eshg/sti-protection-api";

import { Stepper } from "@/lib/businessModules/stiProtection/components/shared/StepContext";

import { FormDataProvider } from "./AppointmentDataContext";
import { PersonalDataStep } from "./PersonalDataStep";
import { PinStep } from "./PinStep";
import { ShareAuthStep } from "./ShareAuthStep";
import { TimeSlotStep } from "./TimeSlotStep";

const steps = [TimeSlotStep, PersonalDataStep, PinStep, ShareAuthStep] as const;

export function AppointmentStepper({ concern }: { concern: ApiConcern }) {
  return (
    <FormDataProvider initialData={{ concern }}>
      <Stepper steps={steps} />
    </FormDataProvider>
  );
}
export interface AppointmentFormData {
  concern: ApiConcern;

  // Timeslot Step
  appointment?: ApiAppointment | null;
  date?: Date | null;

  // From Booked Appointment
  procedureId?: string;
  bookedAppointment?: ApiAppointment;

  // Personal Data Step
  gender?: ApiGender | null;
  birthYear?: number | "";
  pronouns?: string;
  hasSufficientGermanLanguageSkills?: YesOrNoFieldData;
  otherKnownLanguages?: string;

  otherLanguage?: number | "";

  // Pin Step
  pin?: string;
  repeatedPin?: string;

  // From Creating a user
  accessCode?: string;

  // Share Auth Step
  hasSavedPin?: boolean;
  hasDownloadedDoc?: boolean;
}

export type FormDataWithoutConcern = Omit<AppointmentFormData, "concern">;
