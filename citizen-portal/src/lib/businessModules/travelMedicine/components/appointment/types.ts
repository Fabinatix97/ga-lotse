/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiCountryCode,
  ApiTravelTimeUnit,
  ApiTravelType,
} from "@eshg/citizen-portal-api/travelMedicine";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

export interface AppointmentFormValues {
  patient: PatientFormValues;
  travelInformation: TravelInformationFormValues;
  initialStepAppointmentType: ApiAppointmentType;
  appointmentStart: string;
  durationInMinutes: string;
}

export interface PatientFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  emailAddresses: string;
  phoneNumbers: string;
}

export interface TravelInformationFormValues {
  travelType: OptionalFieldValue<ApiTravelType>;
  travelDestinations: ApiCountryCode[];
  travelStartDate: OptionalFieldValue<string>;
  travelTimeAmount: OptionalFieldValue<string>;
  travelTimeUnit: OptionalFieldValue<ApiTravelTimeUnit>;
}

export interface InitialAppointmentFormValues extends AppointmentFormValues {
  appointmentBlockDate: string;
  confirmPrivacyPolicy: boolean;
  confirmPrivacyNotice: boolean;
  confirmOnlineServices: boolean;
}
