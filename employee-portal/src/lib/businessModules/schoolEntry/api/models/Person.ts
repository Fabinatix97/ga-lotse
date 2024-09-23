/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCountryCode,
  ApiGender,
  ApiPersonDetails,
  ApiSalutation,
} from "@eshg/employee-portal-api/schoolEntry";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";

import { mapApiAddressToForm } from "@/lib/shared/components/form/address/helpers";
import { DefaultPersonFormValues } from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import { normalizeListInputs } from "@/lib/shared/components/personSidebar/helpers";
import { BaseAddress } from "@/lib/shared/helpers/address";

import { mapOptional } from "./utils";

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
    fileStateId: response.fileStateId,
    version: response.version,
    outdated: response.fileStateOutdated,
    title: response.title,
    salutation: response.salutation,
    nameAtBirth: response.nameAtBirth,
    placeOfBirth: response.placeOfBirth,
    countryOfBirth: response.countryOfBirth,
    emailAddresses: mapOptional(response.emailAddresses, mapListIfNonEmpty),
    phoneNumbers: mapOptional(response.phoneNumbers, mapListIfNonEmpty),
    contactAddress: response.contactAddress,
    differentBillingAddress: response.differentBillingAddress,
  };
}

function mapListIfNonEmpty(list: string[]) {
  return list.length === 0 ? undefined : list;
}

export function mapPersonDetailsToForm(
  child: PersonDetails,
): DefaultPersonFormValues {
  return {
    salutation: child.salutation,
    title: child.title ?? "",
    firstName: child.firstName,
    lastName: child.lastName,
    dateOfBirth: toDateString(child.dateOfBirth),
    gender: child.gender,
    countryOfBirth: child.countryOfBirth ?? "",
    nameAtBirth: child.nameAtBirth ?? "",
    placeOfBirth: child.placeOfBirth ?? "",
    emailAddresses: normalizeListInputs(child.emailAddresses),
    phoneNumbers: normalizeListInputs(child.phoneNumbers),
    contactAddress: mapOptional(child.contactAddress, mapApiAddressToForm),
    differentBillingAddress: mapOptional(
      child.differentBillingAddress,
      mapApiAddressToForm,
    ),
  };
}
