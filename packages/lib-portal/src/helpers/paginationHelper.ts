/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function getLastPage(pageSize: number, totalCount: number) {
  return Math.max(0, Math.ceil(totalCount / pageSize - 1));
}
