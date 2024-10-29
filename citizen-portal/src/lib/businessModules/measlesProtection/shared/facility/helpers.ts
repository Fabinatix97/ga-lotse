/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddFacilityFileStateRequest,
  ApiAddFacilityFileStateRequestContactAddress,
  ApiDataOrigin,
  ApiFacilityContactPerson,
} from "@eshg/citizen-portal-api/measlesProtection";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";

import {
  FacilityContactAddressFormInputs,
  FacilityContactPersonFormInputs,
  FacilityFormInputs,
} from "@/lib/businessModules/measlesProtection/components/reportCase/types";

export function mapContactPersonToApi(
  contactPerson: FacilityContactPersonFormInputs,
): ApiFacilityContactPerson {
  return {
    emailAddress: contactPerson.emailAddress.trim(),
    firstName: contactPerson.firstName.trim(),
    lastName: contactPerson.lastName.trim(),
    phoneNumber: contactPerson.phoneNumber.trim(),
    role: mapOptionalValue(contactPerson.role)?.trim(),
    salutation: mapOptionalValue(contactPerson.salutation),
    title: mapOptionalValue(contactPerson.title)?.trim(),
  };
}

export function mapFacilityAddressToApi(
  address: FacilityContactAddressFormInputs,
): ApiAddFacilityFileStateRequestContactAddress | undefined {
  switch (address.type) {
    case "DomesticAddress":
      return {
        addressAddition: mapOptionalValue(address.addressAddition?.trim()),
        city: address.city.trim(),
        country: mapOptionalValue(address.country) ?? "DE",
        houseNumber: address.houseNumber?.trim(),
        postalCode: address.postalCode.trim(),
        street: address.street.trim(),
        type: mapOptionalValue(address.type) ?? "DomesticAddress",
      };
    case "PostboxAddress":
      return {
        city: address.city.trim(),
        country: mapOptionalValue(address.country) ?? "DE",
        postalCode: address.postalCode.trim(),
        postbox: address.postbox ?? "",
        type: mapOptionalValue(address.type) ?? "PostboxAddress",
      };
  }
}

export function mapFacilityToApiAddFacilityFileStateRequest(
  facility: FacilityFormInputs,
): ApiAddFacilityFileStateRequest {
  return {
    name: facility.name.trim(),
    emailAddresses: facility.emailAddresses,
    phoneNumbers: facility.phoneNumbers,
    contactAddress: mapFacilityAddressToApi(facility.contactAddress),
    contactPersons: facility.contactPersons.map((contactPerson) =>
      mapContactPersonToApi(contactPerson),
    ),
    dataOrigin: ApiDataOrigin.External,
  };
}
