/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiTravelTimeUnit,
  ApiTravelType,
} from "@eshg/citizen-portal-api/travelMedicine";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

export const TRAVEL_TYPES: EnumMap<ApiTravelType> = {
  [ApiTravelType.Unspecified]: "nicht erfasst",
  [ApiTravelType.NoTravel]: "keine Reise",
  [ApiTravelType.Business]: "Geschäftsreise",
  [ApiTravelType.Vacation]: "Urlaubsreise",
  [ApiTravelType.Backpack]: "Rucksackreise",
};

export const TRAVEL_TIME_UNITS: EnumMap<ApiTravelTimeUnit> = {
  [ApiTravelTimeUnit.Days]: "Tage",
  [ApiTravelTimeUnit.Weeks]: "Wochen",
  [ApiTravelTimeUnit.Months]: "Monate",
  [ApiTravelTimeUnit.Years]: "Jahre",
};

export const APPOINTMENT_TYPE: EnumMap<ApiAppointmentType> = {
  [ApiAppointmentType.Vaccination]: "Impfung",
  [ApiAppointmentType.Consultation]: "Reiseberatung",
  [ApiAppointmentType.RegularExamination]: "Regeluntersuchung",
  [ApiAppointmentType.CanChild]: "Kann-Kinder",
  [ApiAppointmentType.EntryLevel]: "Eingangsstufe",
  [ApiAppointmentType.SpecialNeeds]: "Besonderer Förderbedarf",
  [ApiAppointmentType.ProofSubmission]: "Nachweisvorlage",
  [ApiAppointmentType.HivStiConsultation]: "HIV-STI-Beratung",
  [ApiAppointmentType.SexWork]: "Sexarbeit",
  [ApiAppointmentType.ResultsReview]: "Ergebnisbesprechung",
};
