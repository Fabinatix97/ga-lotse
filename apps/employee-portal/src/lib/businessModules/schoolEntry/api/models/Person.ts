/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseAddress,
  DefaultPersonFormValues,
  mapApiAddressToForm,
  mapOptional,
  normalizeListInputs,
} from "@eshg/lib-employee-portal";
import { parseOptionalValue, toDateString } from "@eshg/lib-portal";
import {
  ApiCountryCode,
  ApiGender,
  ApiPersonDetails,
  ApiSalutation,
} from "@eshg/school-entry-api";

interface PersonProps {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: ApiGender;
}

export interface Person {
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: Date;
  readonly gender: ApiGender;
}

export interface PersonDetails extends Person {
  readonly humanReadableId: string;
  readonly fileStateId: string;
  readonly version: number;
  readonly outdated: boolean;
  readonly title?: string;
  readonly salutation: ApiSalutation;
  readonly nameAtBirth?: string;
  readonly placeOfBirth?: string;
  readonly countryOfBirth?: ApiCountryCode;
  readonly emailAddresses?: string[];
  readonly phoneNumbers?: string[];
  readonly contactAddress?: BaseAddress;
  readonly differentBillingAddress?: BaseAddress;
}

export function mapPerson(response: PersonProps): Person {
  return {
    firstName: response.firstName,
    lastName: response.lastName,
    dateOfBirth: response.dateOfBirth,
    gender: response.gender,
  };
}

export function mapPersonDetails(response: ApiPersonDetails): PersonDetails {
  return {
    ...mapPerson(response),
    humanReadableId: response.humanReadableId,
    fileStateId: response.fileStateId,
    version: response.version,
    outdated: response.fileStateOutdated,
    title: response.title,
    salutation: response.salutation,
    nameAtBirth: response.nameAtBirth,
    placeOfBirth: response.placeOfBirth,
    countryOfBirth: response.countryOfBirth,
    emailAddresses: response.emailAddresses,
    phoneNumbers: response.phoneNumbers,
    contactAddress: response.contactAddress,
    differentBillingAddress: response.differentBillingAddress,
  };
}

export function mapPersonDetailsToForm(
  child: PersonDetails,
): DefaultPersonFormValues {
  return {
    salutation: child.salutation,
    title: parseOptionalValue(child.title),
    firstName: child.firstName,
    lastName: child.lastName,
    dateOfBirth: toDateString(child.dateOfBirth),
    gender: child.gender,
    countryOfBirth: parseOptionalValue(child.countryOfBirth),
    nameAtBirth: parseOptionalValue(child.nameAtBirth),
    placeOfBirth: parseOptionalValue(child.placeOfBirth),
    emailAddresses: normalizeListInputs(child.emailAddresses),
    phoneNumbers: normalizeListInputs(child.phoneNumbers),
    contactAddress: mapOptional(child.contactAddress, mapApiAddressToForm),
    differentBillingAddress: mapOptional(
      child.differentBillingAddress,
      mapApiAddressToForm,
    ),
  };
}
