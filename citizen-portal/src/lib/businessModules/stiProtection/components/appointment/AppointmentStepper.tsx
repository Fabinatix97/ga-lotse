/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Appointment } from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import { ApiConcern } from "@eshg/sti-protection-api";

import { Stepper } from "@/lib/businessModules/stiProtection/components/shared/StepContext";

import { FormDataProvider } from "./AppointmentDataContext";
import { TimeSlotStep } from "./TimeSlotStep";

const steps = [
  TimeSlotStep,
  TimeSlotStep,
  // PersonalDataStep,
  // PinStep,
  // ShareAuthStep,
  // AppointmentReviewStep,
] as const;

export function AppointmentStepper({ concern }: { concern: ApiConcern }) {
  return (
    <FormDataProvider initialData={{ concern } as AppointmentFormData}>
      <Stepper steps={steps} />
    </FormDataProvider>
  );
}

export interface AppointmentFormData {
  concern: ApiConcern;

  // Timeslot Step
  appointment?: Appointment;
  date?: Date;
}
