/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  InitialAppointmentFormValues,
  PatientFormValues,
  TravelInformationFormValues,
} from "@/lib/businessModules/travelMedicine/components/appointment/types";

export function createInitialPatient(): PatientFormValues {
  return {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    emailAddresses: "",
    phoneNumbers: "",
  };
}

export function createInitialTravelInformation(): TravelInformationFormValues {
  return {
    travelType: "",
    travelDestinations: [],
    travelStartDate: "",
    travelTimeAmount: "",
    travelTimeUnit: "",
  };
}

export const initialValues: InitialAppointmentFormValues = {
  patient: createInitialPatient(),
  travelInformation: createInitialTravelInformation(),
  initialStepAppointmentType: "",
  appointmentStart: "",
  durationInMinutes: "",
  appointmentBlockDate: "",
  confirmPrivacyPolicy: false,
  confirmPrivacyNotice: false,
  confirmOnlineServices: false,
};
