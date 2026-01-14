/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined } from "remeda";

import {
  ApiAddPersonFileStateRequest,
  ApiAddPersonWithoutDateOfBirthRequest,
  ApiGetReferencePersonResponse,
  ApiPersonDetails,
} from "@eshg/base-api";
import {
  dropBlankStrings,
  mapOptionalValue,
  toDateString,
} from "@eshg/lib-portal";

import {
  mapApiAddressToForm,
  mapBaseAddressToApi,
} from "../../../components/address/helpers";
import { DefaultPersonFormValues } from "../components/form/DefaultPersonForm";

import { isReferencePerson } from "./guards";

export function normalizeListInputs(input: string[] | undefined): string[] {
  return input === undefined || input.length === 0 ? [""] : input;
}

function mapReferencePersonToAddRequest(
  person: ApiGetReferencePersonResponse,
): ApiAddPersonFileStateRequest {
  return {
    dataOrigin: "MANUAL",
    referencePersonId: person.id,
    firstName: person.firstName,
    lastName: person.lastName,
    dateOfBirth: person.dateOfBirth,
    title: person.title,
    salutation: person.salutation,
    gender: person.gender,
    nameAtBirth: person.nameAtBirth,
    placeOfBirth: person.placeOfBirth,
    countryOfBirth: person.countryOfBirth,
    emailAddresses: person.emailAddresses,
    phoneNumbers: person.phoneNumbers,
    contactAddress: person.contactAddress,
    differentBillingAddress: person.differentBillingAddress,
  };
}

function mapCreatePersonToAddRequest(
  person: DefaultPersonFormValues,
): ApiAddPersonFileStateRequest {
  return {
    dataOrigin: "MANUAL",
    title: mapOptionalValue(person.title),
    salutation: mapOptionalValue(person.salutation),
    gender: mapOptionalValue(person.gender),
    firstName: person.firstName,
    lastName: person.lastName,
    dateOfBirth: new Date(person.dateOfBirth),
    placeOfBirth: mapOptionalValue(person.placeOfBirth),
    nameAtBirth: mapOptionalValue(person.nameAtBirth),
    countryOfBirth: mapOptionalValue(person.countryOfBirth),
    phoneNumbers: dropBlankStrings(person.phoneNumbers),
    emailAddresses: dropBlankStrings(person.emailAddresses),
    contactAddress: isDefined(person.contactAddress)
      ? mapBaseAddressToApi(person.contactAddress)
      : undefined,
    differentBillingAddress: isDefined(person.differentBillingAddress)
      ? mapBaseAddressToApi(person.differentBillingAddress)
      : undefined,
  };
}

export function mapToPersonAddRequest(
  person: DefaultPersonFormValues | ApiGetReferencePersonResponse,
): ApiAddPersonFileStateRequest {
  return isReferencePerson(person)
    ? mapReferencePersonToAddRequest(person)
    : mapCreatePersonToAddRequest(person);
}

export function mapToPersonWithoutDateOfBirthAddRequest(
  person: DefaultPersonFormValues,
): ApiAddPersonWithoutDateOfBirthRequest {
  return {
    dataOrigin: "MANUAL",
    title: mapOptionalValue(person.title),
    salutation: mapOptionalValue(person.salutation),
    gender: mapOptionalValue(person.gender),
    firstName: person.firstName,
    lastName: person.lastName,
    phoneNumbers: dropBlankStrings(person.phoneNumbers),
    emailAddresses: dropBlankStrings(person.emailAddresses),
    contactAddress: isDefined(person.contactAddress)
      ? mapBaseAddressToApi(person.contactAddress)
      : undefined,
  };
}

export function mapToPersonUpdateRequest(
  person: DefaultPersonFormValues,
  version: number,
) {
  return {
    ...mapToPersonAddRequest(person),
    version,
  } satisfies ApiPersonDetails & { version: number };
}

export function mapReferencePersonToForm(
  person: Omit<ApiGetReferencePersonResponse, "id">,
): DefaultPersonFormValues {
  return {
    firstName: person.firstName,
    lastName: person.lastName,
    dateOfBirth: toDateString(person.dateOfBirth),
    gender: person.gender ?? "",
    salutation: person.salutation ?? "",
    title: person.title ?? "",
    nameAtBirth: person.nameAtBirth ?? "",
    placeOfBirth: person.placeOfBirth ?? "",
    countryOfBirth: person.countryOfBirth ?? "",
    emailAddresses: person.emailAddresses,
    phoneNumbers: person.phoneNumbers,
    contactAddress: isDefined(person.contactAddress)
      ? mapApiAddressToForm(person.contactAddress)
      : undefined,
    differentBillingAddress: isDefined(person.differentBillingAddress)
      ? mapApiAddressToForm(person.differentBillingAddress)
      : undefined,
  };
}
