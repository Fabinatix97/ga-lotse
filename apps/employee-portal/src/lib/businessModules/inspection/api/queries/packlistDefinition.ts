/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { PacklistDefinitionApi } from "@eshg/inspection-api";

import { usePacklistDefinitionApi } from "@/lib/businessModules/inspection/api/clients";
import { packlistDefinitionApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function useGetPacklistDefinitions() {
  const packlistDefinitionApi = usePacklistDefinitionApi();
  return useSuspenseQuery({
    queryKey: packlistDefinitionApiQueryKey(["getPacklistDefinitions"]),
    queryFn: () => packlistDefinitionApi.getPacklistDefinitions(),
    select: (response) => response.definitions,
  });
}

export function getPacklistDefinitionRevisionQuery(
  packlistDefinitionApi: PacklistDefinitionApi,
  versionId: string,
) {
  return queryOptions({
    queryKey: packlistDefinitionApiQueryKey([
      "getPacklistDefinitionRevision",
      { versionId },
    ]),
    queryFn: () =>
      packlistDefinitionApi.getPacklistDefinitionRevision(versionId),
  });
}

export function useGetPacklistDefinitionRevisions(defId: string) {
  const packlistDefinitionApi = usePacklistDefinitionApi();
  return useSuspenseQuery({
    queryKey: packlistDefinitionApiQueryKey([
      "getPacklistDefinitionRevisions",
      { defId },
    ]),
    queryFn: () => packlistDefinitionApi.getPacklistDefinitionRevisions(defId),
    select: (response) => response.revisions,
  });
}
