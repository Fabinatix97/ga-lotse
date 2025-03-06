/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  durationBetweenDatesInMinutes,
  toDateString,
} from "@eshg/lib-portal/helpers/dateTime";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import {
  ApiAppointmentBookingType,
  ApiPatchVaccinationConsultationPatientRequest,
  ApiPatient,
  ApiPostVaccinationConsultationRequest,
  ApiTravelType,
} from "@eshg/travel-medicine-api";

import { InitialAppointmentFormValuesProps } from "@/lib/businessModules/travelMedicine/components/personSidebar/appointment/InitialAppointmentForm";
import { mapToApiPersonAddress } from "@/lib/businessModules/travelMedicine/shared/helper";
import { createEmptyLegacyAddress } from "@/lib/shared/components/form/address/LegacyAddressForm";
import { ApiFacilityAddressType } from "@/lib/shared/components/form/address/legacyTypes";
import { BASE_PERSON_VALUES } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyBasePersonForm";
import {
  LegacyPerson,
  LegacyPersonFormConfig,
  PERSON_VALUES,
} from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import { mapToBasePersonData } from "@/lib/shared/components/legacyPersonSidebar/personSidebarHelper";

function mapToApiAffectedPersonDetails(basePerson: LegacyPerson): ApiPatient {
  return {
    ...PERSON_VALUES,
    ...mapToBasePersonData(basePerson),
    dateOfBirth: new Date(basePerson.dateOfBirth),
    countryOfBirth: mapOptionalValue(basePerson.countryOfBirth),
    address:
      basePerson.postalAddress !== undefined &&
      basePerson.postalAddress.street.length != 0
        ? mapToApiPersonAddress(basePerson.postalAddress)
        : undefined,
  };
}

export function mapToApiPatient(basePerson: LegacyPerson): ApiPatient {
  return {
    ...mapToBasePersonData(basePerson),
    dateOfBirth: new Date(basePerson.dateOfBirth),
    countryOfBirth: mapOptionalValue(basePerson.countryOfBirth),
    address:
      basePerson.postalAddress !== undefined &&
      basePerson.postalAddress.street.length != 0
        ? mapToApiPersonAddress(basePerson.postalAddress)
        : undefined,
  };
}

export function mapToPersonFormData(person: ApiPatient): LegacyPerson {
  return {
    ...BASE_PERSON_VALUES,
    ...mapToBasePersonData(person),
    dateOfBirth: toDateString(person.dateOfBirth),
    postalAddress: {
      ...(person.address ??
        createEmptyLegacyAddress(ApiFacilityAddressType.Postal)),
      addressAddition: person.address?.addressAddition ?? "",
      type: ApiFacilityAddressType.Postal,
    },
  };
}

export function mapToApiPatchVaccinationConsultationPatientRequest(
  person: LegacyPerson,
): ApiPatchVaccinationConsultationPatientRequest {
  return { patient: mapToApiPatient(person) };
}

export function mapToApiPostVaccinationConsultationRequest(
  data: InitialAppointmentFormValuesProps,
): ApiPostVaccinationConsultationRequest {
  let appointmentStart;
  let durationInMinutes;
  if (data.bookingType == ApiAppointmentBookingType.UserDefined) {
    appointmentStart = new Date(data.userDefinedAppointmentDate!);
    durationInMinutes = data.appointmentTypeStandardDuration;
  } else {
    appointmentStart = data.appointmentBlockDate!.start;
    durationInMinutes = durationBetweenDatesInMinutes(
      data.appointmentBlockDate!.start,
      data.appointmentBlockDate!.end,
    );
  }
  return {
    ...data,
    patient: mapToApiAffectedPersonDetails(data.selectedPerson!),
    initialStepAppointmentType: data.initialStepAppointmentType,
    appointmentBookingType: data.bookingType!,
    appointmentStart: appointmentStart,
    durationInMinutes: durationInMinutes,
    travelType: ApiTravelType.Unspecified,
    travelDestinations: [],
  };
}

export enum PersonSidebarMode {
  // search for person in central file
  searchInCentralFile,
  // create new person or add additional information to person
  editInCentralFile,
  // book appointment
  bookAppointment,
}

export const TRAVEL_MEDICINE_EDIT_PERSON_CONFIG: LegacyPersonFormConfig = {
  hiddenFields: ["billingAddress"],
  optionalFields: [
    "salutation",
    "title",
    "gender",
    "nameAtBirth",
    "placeOfBirth",
    "countryOfBirth",
    "phoneNumbers",
    "postalAddress",
    "emailAddresses",
  ],
};

export const TRAVEL_MEDICINE_PERSON_CONFIG: LegacyPersonFormConfig = {
  ...TRAVEL_MEDICINE_EDIT_PERSON_CONFIG,
  disabledFields: ["firstName", "lastName", "dateOfBirth"],
};
