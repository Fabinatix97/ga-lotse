/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

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

export function useGetPacklistDefinitionRevision(versionId: string) {
  const packlistDefinitionApi = usePacklistDefinitionApi();
  return useSuspenseQuery({
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
