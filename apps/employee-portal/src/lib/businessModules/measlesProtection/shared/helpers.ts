/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { ApiAddPersonFileStateRequest } from "@eshg/base-api";
import {
  DefaultPersonFormValues,
  mapBaseAddressToApi,
  mapToPersonAddRequest,
} from "@eshg/lib-employee-portal";
import { dropBlankStrings, mapOptionalValue } from "@eshg/lib-portal";
import {
  ApiAddCustodianRequest,
  ApiAddCustodianWithoutDateOfBirthRequest,
  ApiAffectedPersonDetails,
  ApiCreatePersonRequest,
} from "@eshg/measles-protection-api";

export function mapToCreateProcedureRequest(
  values: DefaultPersonFormValues,
): ApiCreatePersonRequest {
  const person = mapToPersonAddRequest(values);
  return {
    person: mapToAffectedPerson(person),
  };
}

export function mapToAffectedPerson(
  person: ApiAddPersonFileStateRequest,
): ApiAffectedPersonDetails {
  return {
    ...person,
    address: person.contactAddress,
  };
}

export function mapToAddCustodianRequest(
  values: DefaultPersonFormValues,
): ApiAddCustodianRequest {
  const person = mapToPersonAddRequest(values);
  return {
    custodian: mapToAffectedPerson(person),
  };
}

export function mapToAddCustodianWithoutDateOfBirthRequest(
  values: DefaultPersonFormValues,
): ApiAddCustodianWithoutDateOfBirthRequest {
  const person = {
    dataOrigin: "MANUAL",
    title: mapOptionalValue(values.title),
    salutation: mapOptionalValue(values.salutation),
    gender: mapOptionalValue(values.gender),
    firstName: values.firstName,
    lastName: values.lastName,
    phoneNumbers: dropBlankStrings(values.phoneNumbers),
    emailAddresses: dropBlankStrings(values.emailAddresses),
    address: isDefined(values.contactAddress)
      ? mapBaseAddressToApi(values.contactAddress)
      : undefined,
  };
  return {
    custodian: person,
  };
}
