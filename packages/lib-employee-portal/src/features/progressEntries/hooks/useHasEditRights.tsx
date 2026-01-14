/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiManualProgressEntry } from "@eshg/lib-procedures-api";

import { useGetSelfUser } from "../../auth/api/queries";

export function useHasEditRights(entry: ApiManualProgressEntry) {
  const { data: selfUser } = useGetSelfUser();
  return selfUser.userId === entry.createdBy;
}
