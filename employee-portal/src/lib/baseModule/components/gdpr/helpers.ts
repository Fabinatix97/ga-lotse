/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGdprFacility,
  ApiGdprIdentificationData,
  ApiGdprPerson,
  instanceOfApiGdprFacility,
  instanceOfApiGdprPerson,
} from "@eshg/employee-portal-api/base";

export function isGdprPerson(
  identificationData: ApiGdprIdentificationData,
): identificationData is ApiGdprPerson {
  return instanceOfApiGdprPerson(identificationData);
}

export function isGdprFacility(
  identificationData: ApiGdprIdentificationData,
): identificationData is ApiGdprFacility {
  return instanceOfApiGdprFacility(identificationData);
}
