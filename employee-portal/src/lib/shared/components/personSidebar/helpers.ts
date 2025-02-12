/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiAddPersonFileStateRequest,
  ApiGetReferencePersonResponse,
  ApiPersonDetails,
  instanceOfApiGetReferencePersonResponse,
} from "@eshg/base-api";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import {
  dropBlankStrings,
  mapOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { isDefined } from "remeda";

import {
  mapApiAddressToForm,
  mapBaseAddressToApi,
} from "@/lib/shared/components/form/address/helpers";
import { DefaultPersonFormValues } from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";

export function normalizeListInputs(input: string[] | undefined): string[] {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return input === undefined || input.length === 0 ? [""] : input;
}

export function mapReferencePersonToAddRequest(
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

export function mapCreatePersonToAddRequest(
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

function isReferencePerson(
  person: object,
): person is ApiGetReferencePersonResponse {
  return instanceOfApiGetReferencePersonResponse(person);
}

export function mapToPersonAddRequest(
  person: DefaultPersonFormValues | ApiGetReferencePersonResponse,
): ApiAddPersonFileStateRequest {
  return isReferencePerson(person)
    ? mapReferencePersonToAddRequest(person)
    : mapCreatePersonToAddRequest(person);
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
