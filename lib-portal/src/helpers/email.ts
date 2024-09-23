/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

// This is the pattern also used by zod https://github.com/colinhacks/zod/blob/master/src/types.ts#L567
const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;

export function isValidEmailString(value: string) {
  return EMAIL_REGEX.test(value);
}
