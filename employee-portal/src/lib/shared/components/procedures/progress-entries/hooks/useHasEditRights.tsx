/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useGetSelfUser } from "@eshg/lib-employee-portal";
import { ApiManualProgressEntry } from "@eshg/lib-procedures-api";

export function useHasEditRights(entry: ApiManualProgressEntry) {
  const { data: selfUser } = useGetSelfUser();
  return selfUser.userId === entry.createdBy;
}
