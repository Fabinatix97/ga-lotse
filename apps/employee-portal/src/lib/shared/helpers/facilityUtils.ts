/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isNullish } from "remeda";

import {
  ApiAddFacilityFileStateRequest,
  ApiAddFacilityFileStateResponse,
  ApiFacilityContactPerson,
} from "@eshg/base-api";
import { ApiDataOrigin } from "@eshg/inspection-api";
import {
  mapApiAddressToForm,
  mapBaseAddressToApi,
} from "@eshg/lib-employee-portal";
import {
  AcademicTitle,
  OptionalFieldValue,
  TITLE_VALUES,
  formatList,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
  mapOptionalValue,
} from "@eshg/lib-portal";

import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { BaseFacilityContactPerson } from "@/lib/shared/components/facilitySidebar/types";

export function fullAddress(address?: {
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
}) {
  return formatList(
    [formatStreetAndHouseNumber(address), formatPostalCodeAndCity(address)],
    ", ",
  );
}

export function mapFacilityFormValuesToApiAddFacilityFileStateRequest(
  baseFacility: DefaultFacilityFormValues & { billingAddress?: void },
): ApiAddFacilityFileStateRequest {
  return {
    name: baseFacility.name,
    emailAddresses: baseFacility.emailAddresses,
    phoneNumbers: baseFacility.phoneNumbers,
    contactAddress: mapBaseAddressToApi(baseFacility.contactAddress),
    differentBillingAddress: isNullish(baseFacility.differentBillingAddress)
      ? undefined
      : mapBaseAddressToApi(baseFacility.differentBillingAddress),
    contactPersons: baseFacility.contactPersons.map(mapContactPersonToApi),
    dataOrigin: ApiDataOrigin.Manual,
  };
}

export function mapApiFacilityStateToFacilityFormValues(
  data: ApiAddFacilityFileStateResponse,
): DefaultFacilityFormValues & { billingAddress?: void } {
  return {
    name: data.name,
    emailAddresses: data.emailAddresses,
    phoneNumbers: data.phoneNumbers,
    contactAddress: mapApiAddressToForm(data.contactAddress!),
    differentBillingAddress: isNullish(data.differentBillingAddress)
      ? undefined
      : mapApiAddressToForm(data.differentBillingAddress),
    contactPersons: data.contactPersons?.map(mapApiContactPersonToForm) ?? [],
  };
}

const notSpecifiedTitle = TITLE_VALUES[AcademicTitle.NotSpecified]!;

export function createEmptyContactPerson(): BaseFacilityContactPerson {
  return {
    firstName: "",
    emailAddress: "",
    lastName: "",
    phoneNumber: "",
    role: "",
    title: notSpecifiedTitle,
    gender: "",
    salutation: "",
    mainContact: false,
  };
}

export function mapApiContactPersonToForm(
  contactPerson: ApiFacilityContactPerson,
): BaseFacilityContactPerson {
  return {
    emailAddress: contactPerson.emailAddress ?? "",
    firstName: contactPerson.firstName ?? "",
    lastName: contactPerson.lastName ?? "",
    phoneNumber: contactPerson.phoneNumber ?? "",
    role: contactPerson.role ?? "",
    title: contactPerson.title ?? notSpecifiedTitle,
    salutation: contactPerson.salutation ?? "",
    gender: contactPerson.gender ?? "",
    mainContact: contactPerson.mainContact ?? false,
  };
}

export function mapContactPersonToApi(
  contactPerson: BaseFacilityContactPerson,
): ApiFacilityContactPerson {
  return {
    emailAddress: mapOptionalValue(contactPerson.emailAddress)?.trim(),
    firstName: mapOptionalValue(contactPerson.firstName)?.trim(),
    lastName: contactPerson.lastName,
    phoneNumber: mapOptionalValue(contactPerson.phoneNumber)?.trim(),
    role: mapOptionalValue(contactPerson.role)?.trim(),
    title: mapTitle(contactPerson.title),
    salutation: mapOptionalValue(contactPerson.salutation),
    gender: mapOptionalValue(contactPerson.gender),
    mainContact: contactPerson.mainContact,
  };
}

function mapTitle(value: OptionalFieldValue<string>): string | undefined {
  return value === notSpecifiedTitle ? undefined : value;
}
