/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap } from "@eshg/lib-portal/types/helpers";
import {
  ApiAppointmentBookingType,
  ApiProcedureStatus,
  ApiServiceStatus,
  ApiTravelTimeUnit,
  ApiTravelType,
} from "@eshg/travel-medicine-api";

import { AllowedProcedureStatusForSearch } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultationSearch/VaccinationConsultationsSearchFilterSettings";

export enum MedicalHistoryAnswerStatusType {
  Answered = "ANSWERED",
  PartiallyAnswered = "PARTIALLY_ANSWERED",
  NotAnswered = "NOT_ANSWERED",
}

export type MedicalHistoryAnswerStatus =
  (typeof MedicalHistoryAnswerStatusType)[keyof typeof MedicalHistoryAnswerStatusType];

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

export const STATUS_NAMES: EnumMap<ApiServiceStatus> = {
  [ApiServiceStatus.Open]: "Offen",
  [ApiServiceStatus.Planned]: "Geplant",
  [ApiServiceStatus.Accomplished]: "Erledigt",
};

export const STATUS_NAMES_APPOINTMENT: EnumMap<ApiAppointmentBookingType> = {
  [ApiAppointmentBookingType.AppointmentBlock]: "Gebucht",
  [ApiAppointmentBookingType.UserDefined]: "Gebucht",
  [ApiAppointmentBookingType.SelfBooking]: "Noch nicht gebucht",
  [ApiAppointmentBookingType.Cancelled]: "Abgesagt",
};

export const PROCEDURE_STATUS_NAMES_FOR_SEARCH: EnumMap<AllowedProcedureStatusForSearch> =
  {
    [ApiProcedureStatus.Draft]: "Geplant",
    [ApiProcedureStatus.InProgress]: "In Ausführung",
    [ApiProcedureStatus.Open]: "Offen",
  };

export const STATUS_NAMES_MEDICAL_HISTORY_ANSWER = {
  [MedicalHistoryAnswerStatusType.Answered]: "Anamnese vollständig beantwortet",
  [MedicalHistoryAnswerStatusType.PartiallyAnswered]:
    "Anamnese unvollständig abgesendet",
  [MedicalHistoryAnswerStatusType.NotAnswered]: "Anamnese nicht beantwortet",
} satisfies Record<MedicalHistoryAnswerStatus, string>;
