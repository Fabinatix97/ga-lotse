/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function mapToOptionalPhoneNumbers(phoneNumbers: string[]) {
  if (phoneNumbers.length === 0) {
    return ["-"];
  }
  return phoneNumbers;
}
