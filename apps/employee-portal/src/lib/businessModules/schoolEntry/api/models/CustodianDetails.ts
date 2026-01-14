/**
 * Copyright 2026 cronn GmbH
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
  ApiCustodianDetails,
  ApiGender,
  ApiSalutation,
} from "@eshg/school-entry-api";

import { mapAddress } from "@/lib/businessModules/schoolEntry/api/models/Person";

export interface CustodianDetails {
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth?: Date;
  readonly gender: ApiGender;
  readonly humanReadableId?: string;
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

export function mapCustodianDetails(
  response: ApiCustodianDetails,
): CustodianDetails {
  return {
    firstName: response.firstName,
    lastName: response.lastName,
    dateOfBirth: response.dateOfBirth,
    gender: response.gender,
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
    contactAddress: mapAddress(response.contactAddress),
    differentBillingAddress: mapAddress(response.differentBillingAddress),
  };
}

export function mapCustodianDetailsToForm(
  custodian: CustodianDetails,
): DefaultPersonFormValues {
  return {
    salutation: custodian.salutation,
    title: parseOptionalValue(custodian.title),
    firstName: custodian.firstName,
    lastName: custodian.lastName,
    dateOfBirth: custodian.dateOfBirth
      ? toDateString(custodian.dateOfBirth)
      : "",
    gender: custodian.gender,
    countryOfBirth: parseOptionalValue(custodian.countryOfBirth),
    nameAtBirth: parseOptionalValue(custodian.nameAtBirth),
    placeOfBirth: parseOptionalValue(custodian.placeOfBirth),
    emailAddresses: normalizeListInputs(custodian.emailAddresses),
    phoneNumbers: normalizeListInputs(custodian.phoneNumbers),
    contactAddress: mapOptional(custodian.contactAddress, mapApiAddressToForm),
    differentBillingAddress: mapOptional(
      custodian.differentBillingAddress,
      mapApiAddressToForm,
    ),
  };
}
