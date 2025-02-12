/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiAddFacilityFileStateRequest,
  ApiAddFacilityFileStateResponse,
  ApiFacilityContactPerson,
} from "@eshg/base-api";
import { ApiDataOrigin } from "@eshg/inspection-api";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { isNullish } from "remeda";

import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import {
  BaseFacility,
  BaseFacilityContactPerson,
} from "@/lib/shared/components/facilitySidebar/types";
import {
  mapApiAddressToForm,
  mapBaseAddressToApi,
} from "@/lib/shared/components/form/address/helpers";
import { join } from "@/lib/shared/helpers/strings";

export function streetAndHouseNumber(address?: {
  street?: string;
  houseNumber?: string;
}) {
  return join([address?.street, address?.houseNumber], " ");
}

export function postalCodeAndCity(address?: {
  postalCode?: string;
  city?: string;
}) {
  return join([address?.postalCode, address?.city], " ");
}

export function fullAddress(address?: {
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
}) {
  return join(
    [streetAndHouseNumber(address), postalCodeAndCity(address)],
    ", ",
  );
}

/**
 * BaseFacility is still used in the legacy facility sidebar.
 */
export function mapBaseFacilityToApiAddFacilityFileStateRequest(
  baseFacility: BaseFacility & { differentBillingAddress?: void },
): ApiAddFacilityFileStateRequest {
  return {
    name: baseFacility.name,
    emailAddresses: baseFacility.emailAddresses,
    phoneNumbers: baseFacility.phoneNumbers,
    contactAddress: mapBaseAddressToApi(baseFacility.contactAddress),
    differentBillingAddress: isNullish(baseFacility.billingAddress)
      ? undefined
      : mapBaseAddressToApi(baseFacility.billingAddress),
    contactPersons: baseFacility.contactPersons.map(mapContactPersonToApi),
    dataOrigin: ApiDataOrigin.Manual,
  };
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

export function createEmptyContactPerson(): BaseFacilityContactPerson {
  return {
    firstName: "",
    emailAddress: "",
    lastName: "",
    phoneNumber: "",
    role: "",
    title: "",
    gender: "",
    salutation: "",
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
    title: contactPerson.title ?? "",
    salutation: contactPerson.salutation ?? "",
    gender: contactPerson.gender ?? "",
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
    title: mapOptionalValue(contactPerson.title)?.trim(),
    salutation: mapOptionalValue(contactPerson.salutation),
    gender: mapOptionalValue(contactPerson.gender),
  };
}
