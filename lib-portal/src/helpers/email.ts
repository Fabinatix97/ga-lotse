/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

// This is the pattern also used by zod https://github.com/colinhacks/zod/blob/master/src/types.ts#L567
// Modified to include constraints which come into effect during the backend validation (see `org.hibernate.validator.internal.util.DomainNameUtil.isValidEmailDomainAddress()`)
const EMAIL_REGEX =
  /^(?=.{6,254})(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9]+(-+[A-Z0-9]+)*\.)+[A-Z]{2,}$/i;

export function isValidEmailString(value: string) {
  return EMAIL_REGEX.test(value);
}
