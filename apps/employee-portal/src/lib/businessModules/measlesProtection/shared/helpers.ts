/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddPersonFileStateRequest } from "@eshg/base-api";
import {
  DefaultPersonFormValues,
  mapToPersonAddRequest,
} from "@eshg/lib-employee-portal";
import {
  ApiAddCustodianRequest,
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
