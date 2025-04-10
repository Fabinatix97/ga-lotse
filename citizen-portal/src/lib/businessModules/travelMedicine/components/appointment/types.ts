/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import {
  ApiAppointment,
  ApiAppointmentType,
  ApiCountryCode,
  ApiTravelTimeUnit,
  ApiTravelType,
} from "@eshg/travel-medicine-api";

export interface AppointmentFormValues {
  patient: PatientFormValues;
  travelInformation: TravelInformationFormValues;
  initialStepAppointmentType: OptionalFieldValue<ApiAppointmentType>;
  appointment?: ApiAppointment;
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
  confirmPrivacyPolicy: boolean;
  confirmPrivacyNotice: boolean;
  confirmOnlineServices: boolean;
}
