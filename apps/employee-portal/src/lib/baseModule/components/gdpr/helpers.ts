/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGdprFacility,
  ApiGdprIdentificationData,
  ApiGdprPerson,
  instanceOfApiGdprFacility,
  instanceOfApiGdprPerson,
} from "@eshg/base-api";
import { formatPersonName } from "@eshg/lib-portal";
import { ApiGdprValidationTaskIdentificationData } from "@eshg/lib-procedures-api";

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

export function formatIdentityName(
  identificationData: ApiGdprValidationTaskIdentificationData,
) {
  return isGdprPerson(identificationData)
    ? formatPersonName(identificationData)
    : identificationData.name;
}
