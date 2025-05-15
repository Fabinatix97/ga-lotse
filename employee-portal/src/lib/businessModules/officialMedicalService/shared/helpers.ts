/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddPersonFileStateRequest,
  ApiGetReferenceFacilityResponse,
} from "@eshg/base-api";
import {
  DefaultPersonFormValues,
  mapApiAddressToForm,
  mapBaseAddressToApi,
  mapOptional,
  mapToPersonAddRequest,
  mapToPersonUpdateRequest,
  normalizeListInputs,
} from "@eshg/lib-employee-portal";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import {
  ApiAffectedPerson,
  ApiAppointmentState,
  ApiFacility,
  ApiOmsAppointment,
  ApiPatchAffectedPersonRequest,
  ApiPatchEmployeeOmsProcedureFacilityRequest,
  ApiPostEmployeeOmsProcedureRequest,
  ApiProcedureStatus,
} from "@eshg/official-medical-service-api";

import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import {
  mapApiContactPersonToForm,
  mapContactPersonToApi,
} from "@/lib/shared/helpers/facilityUtils";

export function mapToAffectedPerson(
  person: ApiAddPersonFileStateRequest,
): ApiAffectedPerson {
  return {
    ...person,
    contactAddress: person.contactAddress!,
    version: 0,
  };
}

export function mapToCreateProcedureRequest(
  values: DefaultPersonFormValues,
): ApiPostEmployeeOmsProcedureRequest {
  const person = mapToPersonAddRequest(values);
  return {
    affectedPerson: mapToAffectedPerson(person),
  };
}

export function mapToAffectedPersonWithVersionNumber(
  person: ApiAddPersonFileStateRequest & { version: number },
): ApiAffectedPerson {
  return {
    ...person,
    contactAddress: person.contactAddress!,
  };
}

export function mapToPatchAffectedPersonRequest(
  values: DefaultPersonFormValues,
  version: number,
): ApiPatchAffectedPersonRequest {
  const person = mapToPersonUpdateRequest(values, version);
  return {
    affectedPerson: mapToAffectedPersonWithVersionNumber(person),
  };
}

export function mapToDefaultFacilityFormValues(
  facility: ApiGetReferenceFacilityResponse,
): DefaultFacilityFormValues {
  return {
    name: facility.name,
    contactAddress: mapApiAddressToForm(facility.contactAddress!),
    contactPersons:
      facility.contactPersons?.map(mapApiContactPersonToForm) ?? [],
    emailAddresses: facility.emailAddresses,
    phoneNumbers: facility.phoneNumbers,
  };
}

export function mapApiFacilityToDefaultFacilityFormValues(
  facility: ApiFacility,
): DefaultFacilityFormValues {
  return {
    name: facility.name,
    contactAddress: mapApiAddressToForm(facility.contactAddress!),
    contactPersons:
      facility.contactPersons?.map(mapApiContactPersonToForm) ?? [],
    emailAddresses: facility.emailAddresses ?? [],
    phoneNumbers: facility.phoneNumbers ?? [],
  };
}

export function mapToApiPatchFacilityRequest(
  facility: DefaultFacilityFormValues,
  version: number,
): ApiPatchEmployeeOmsProcedureFacilityRequest {
  return {
    updatedFacility: {
      version: version,
      name: facility.name,
      contactAddress: mapBaseAddressToApi(facility.contactAddress!),
      contactPersons: facility.contactPersons?.map(mapContactPersonToApi) ?? [],
      emailAddresses: facility.emailAddresses ?? [],
      phoneNumbers: facility.phoneNumbers ?? [],
    },
  };
}

export function mapPersonDetailsToForm(
  person: ApiAffectedPerson,
): DefaultPersonFormValues {
  return {
    salutation: person.salutation ?? "",
    title: person.title ?? "",
    firstName: person.firstName,
    lastName: person.lastName,
    dateOfBirth: toDateString(person.dateOfBirth),
    gender: person.gender ?? "",
    countryOfBirth: person.countryOfBirth ?? "",
    nameAtBirth: person.nameAtBirth ?? "",
    placeOfBirth: person.placeOfBirth ?? "",
    emailAddresses: normalizeListInputs(person.emailAddresses),
    phoneNumbers: normalizeListInputs(person.phoneNumbers),
    contactAddress: mapOptional(person.contactAddress, mapApiAddressToForm),
    differentBillingAddress: undefined,
  };
}

export function isProcedureFinalized(procedure: {
  status: ApiProcedureStatus;
}): boolean {
  const finalizedStates: ApiProcedureStatus[] = [
    ApiProcedureStatus.Closed,
    ApiProcedureStatus.Aborted,
  ];
  return finalizedStates.includes(procedure.status);
}

export function isProcedureOpenOrInProgress(procedure: {
  status: ApiProcedureStatus;
}): boolean {
  const openOrInProgressStates: ApiProcedureStatus[] = [
    ApiProcedureStatus.Open,
    ApiProcedureStatus.InProgress,
  ];
  return openOrInProgressStates.includes(procedure.status);
}

export function procedureHasOpenAppointments(procedure: {
  appointments: ApiOmsAppointment[];
}): boolean {
  return procedure.appointments.some(
    (appointment) => appointment.appointmentState === ApiAppointmentState.Open,
  );
}

/**
 * Drags elements to the top of the array if they match the given predicate, keeping
 * their order. Also keeps the order of the remaining elements.
 * @param elements    the input (won't be changed)
 * @param predicate   the condition to apply
 */
export function bringToTop<T>(
  elements: T[],
  predicate: (orig: T) => boolean,
): T[] {
  const matchingElements = elements.filter(predicate);
  const nonMatchingElements = elements.filter((item) => !predicate(item));
  return matchingElements.concat(nonMatchingElements);
}
