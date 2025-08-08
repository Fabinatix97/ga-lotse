/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseAddressFormInputs,
  DefaultPersonFormValues,
  createEmptyAddress,
  isPostboxAddress,
  mapBaseAddressToApi,
  mapOptional,
  normalizeListInputs,
} from "@eshg/lib-employee-portal";
import {
  mapOptionalNonEmptyStringArray,
  mapOptionalValue,
  parseOptionalValue,
  toDateString,
} from "@eshg/lib-portal";
import {
  ApiPatchVaccinationConsultationPatientRequest,
  ApiPatient,
  ApiPersonAddress,
} from "@eshg/travel-medicine-api";

function mapToApiPatient(basePerson: DefaultPersonFormValues): ApiPatient {
  const address = mapBaseAddressToApi(basePerson.contactAddress);
  const differentBillingAddress = mapBaseAddressToApi(
    basePerson.differentBillingAddress,
  );
  if (isPostboxAddress(address)) {
    throw new Error("Postbox address is not supported");
  }
  if (isPostboxAddress(differentBillingAddress)) {
    throw new Error("Postbox address is not supported");
  }
  return {
    address,
    countryOfBirth: mapOptionalValue(basePerson.countryOfBirth),
    dateOfBirth: new Date(basePerson.dateOfBirth),
    differentBillingAddress,
    emailAddresses: mapOptionalNonEmptyStringArray(basePerson.emailAddresses),
    firstName: basePerson.firstName,
    gender: mapOptionalValue(basePerson.gender),
    lastName: basePerson.lastName,
    nameAtBirth: mapOptionalValue(basePerson.nameAtBirth),
    phoneNumbers: mapOptionalNonEmptyStringArray(basePerson.phoneNumbers),
    placeOfBirth: mapOptionalValue(basePerson.placeOfBirth),
    salutation: mapOptionalValue(basePerson.salutation),
    title: mapOptionalValue(basePerson.title),
  };
}

export function mapApiPatientToForm(
  person: ApiPatient,
): DefaultPersonFormValues {
  return {
    salutation: parseOptionalValue(person.salutation),
    title: parseOptionalValue(person.title),
    firstName: person.firstName,
    lastName: person.lastName,
    dateOfBirth: toDateString(person.dateOfBirth),
    gender: parseOptionalValue(person.gender),
    countryOfBirth: parseOptionalValue(person.countryOfBirth),
    nameAtBirth: parseOptionalValue(person.nameAtBirth),
    placeOfBirth: parseOptionalValue(person.placeOfBirth),
    emailAddresses: normalizeListInputs(person.emailAddresses),
    phoneNumbers: normalizeListInputs(person.phoneNumbers),
    contactAddress: mapOptional(person.address, mapApiAddressToForm),
    differentBillingAddress: mapOptional(
      person.differentBillingAddress,
      mapApiAddressToForm,
    ),
  };
}

function mapApiAddressToForm(address: ApiPersonAddress): BaseAddressFormInputs {
  const values: BaseAddressFormInputs = createEmptyAddress();

  return {
    ...values,
    type: "DomesticAddress",
    street: address.street,
    houseNumber: address.houseNumber ?? "",
    addressAddition: address.addressAddition ?? "",
    country: address.country,
    postalCode: address.postalCode,
    city: address.city,
  };
}

export function mapToApiPatchVaccinationConsultationPatientRequest(
  person: DefaultPersonFormValues,
): ApiPatchVaccinationConsultationPatientRequest {
  return { patient: mapToApiPatient(person) };
}
