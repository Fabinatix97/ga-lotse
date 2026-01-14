/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGetReferencePersonResponse,
  instanceOfApiGetReferencePersonResponse,
} from "@eshg/base-api";

export function isReferencePerson(
  person: object,
): person is ApiGetReferencePersonResponse {
  return instanceOfApiGetReferencePersonResponse(person);
}
