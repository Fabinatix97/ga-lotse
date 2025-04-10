/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  durationBetweenDatesInMinutes,
  toUtcDate,
} from "@eshg/lib-portal/helpers/dateTime";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import {
  ApiAppointmentType,
  ApiCountryCode,
  ApiPatient,
  ApiPostCitizenVaccinationConsultationRequest,
  ApiTravelInformation,
  ApiTravelType,
} from "@eshg/travel-medicine-api";
import { isDefined, isEmpty } from "remeda";

import {
  InitialAppointmentFormValues,
  PatientFormValues,
  TravelInformationFormValues,
} from "@/lib/businessModules/travelMedicine/components/appointment/types";

export function mapToApiPostCitizenVaccinationConsultationRequest(
  data: InitialAppointmentFormValues,
): ApiPostCitizenVaccinationConsultationRequest {
  return {
    patient: mapToApiPatient(data.patient),
    travelInformation: mapToApiTravelInformation(data.travelInformation),
    initialStepAppointmentType: !isEmpty(data.initialStepAppointmentType)
      ? data.initialStepAppointmentType
      : ApiAppointmentType.Vaccination,
    appointmentStart: data.appointment!.start,
    durationInMinutes: durationBetweenDatesInMinutes(
      data.appointment!.start,
      data.appointment!.end,
    ),
  };
}

function mapToApiPatient(patient: PatientFormValues): ApiPatient {
  return {
    firstName: patient.firstName.trim(),
    lastName: patient.lastName.trim(),
    dateOfBirth: toUtcDate(patient.dateOfBirth),
    emailAddresses: !isEmptyString(patient.emailAddresses)
      ? [patient.emailAddresses.trim()]
      : undefined,
    phoneNumbers: !isEmptyString(patient.phoneNumbers)
      ? [patient.phoneNumbers.trim()]
      : undefined,
  };
}

function mapToApiTravelInformation(
  travelInformation: TravelInformationFormValues,
): ApiTravelInformation {
  return {
    travelDestinations: isDefined(travelInformation.travelDestinations)
      ? travelInformation.travelDestinations
      : [],
    travelStartDate:
      isDefined(travelInformation.travelStartDate) &&
      !isEmptyString(travelInformation.travelStartDate)
        ? toUtcDate(travelInformation.travelStartDate)
        : undefined,
    travelTimeAmount: isDefined(travelInformation.travelTimeAmount)
      ? Number.parseInt(travelInformation.travelTimeAmount)
      : undefined,
    travelTimeUnit: mapOptionalValue(travelInformation.travelTimeUnit),
    travelType: !isEmptyString(travelInformation.travelType)
      ? travelInformation.travelType
      : ApiTravelType.NoTravel,
  };
}

export function formatTravelDuration(
  label: string,
  travelTimeAmount: string,
  travelTimeUnit: string,
) {
  return `${label} ${travelTimeAmount} ${travelTimeUnit}`;
}

export function formatTravelDestinations(
  label: string,
  travelDestinations: string,
) {
  return `${label} ${travelDestinations}`;
}

export function formatTravelStartDate(label: string, travelStartDate: string) {
  return `${label} ${travelStartDate}`;
}

export function travelDestinationsTranslation(
  destinations: ApiCountryCode[],
  translateCountry: (countryCode: ApiCountryCode) => string,
) {
  const translatedCountries: string[] = [];
  destinations.map((destination) =>
    translatedCountries.push(translateCountry(destination)),
  );
  return translatedCountries.join(", ");
}
