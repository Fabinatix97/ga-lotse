/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined } from "remeda";

export function createFieldNameMapper<T = Record<string, unknown>>(
  rootPath?: string,
) {
  return (fieldName: string & keyof T) =>
    isDefined(rootPath) ? `${rootPath}.${fieldName}` : fieldName;
}
