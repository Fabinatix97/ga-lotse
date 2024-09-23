/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiManualProgressEntry } from "@eshg/employee-portal-api/businessProcedures";

import { useGetSelfUser } from "@/lib/baseModule/api/queries/users";

export function useHasEditRights(entry: ApiManualProgressEntry) {
  const { data: selfUser } = useGetSelfUser();
  return selfUser.userId === entry.createdBy;
}
