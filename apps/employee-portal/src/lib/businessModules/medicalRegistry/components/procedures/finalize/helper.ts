/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetProcedureDraftResponse,
  ApiTypeOfChange,
} from "@eshg/medical-registry-api";

export function mapToOptionalPhoneNumbers(phoneNumbers: string[]) {
  if (phoneNumbers.length === 0) {
    return ["-"];
  }
  return phoneNumbers;
}

const partialTypesOfChange: ApiTypeOfChange[] = [
  ApiTypeOfChange.SecondPractice,
  ApiTypeOfChange.ChangeOfRegistration,
  ApiTypeOfChange.ChangeOfName,
  ApiTypeOfChange.Relocation,
  ApiTypeOfChange.Deregistration,
  ApiTypeOfChange.ChangeOfEmployees,
];

export function isPartialDraft({ typeOfChange }: ApiGetProcedureDraftResponse) {
  return partialTypesOfChange.includes(typeOfChange);
}
