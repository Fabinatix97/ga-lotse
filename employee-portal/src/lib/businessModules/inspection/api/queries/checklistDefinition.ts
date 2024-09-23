/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  useChecklistDefinitionApi,
  useChecklistDefinitionCentralRepoApi,
} from "@/lib/businessModules/inspection/api/clients";
import {
  checklistDefinitionApiQueryKey,
  checklistDefinitionCentralRepoApiQueryKey,
} from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function useGetChecklistDefinitions() {
  const checklistDefinitionApi = useChecklistDefinitionApi();
  return useSuspenseQuery({
    queryKey: checklistDefinitionApiQueryKey(["getChecklistDefinitions"]),
    queryFn: () => checklistDefinitionApi.getChecklistDefinitions(),
    select: (response) => response.definitions,
  });
}

export function useGetChecklistDefinitionVersion(versionId: string) {
  const checklistDefinitionApi = useChecklistDefinitionApi();
  return useSuspenseQuery({
    queryKey: checklistDefinitionApiQueryKey([
      "getChecklistDefinitionVersion",
      { versionId },
    ]),
    queryFn: () =>
      checklistDefinitionApi.getChecklistDefinitionVersion(versionId),
  });
}

export function useGetChecklistDefinitionVersions(defId: string) {
  const checklistDefinitionApi = useChecklistDefinitionApi();
  return useSuspenseQuery({
    queryKey: checklistDefinitionApiQueryKey([
      "getChecklistDefinitionVersions",
      { defId },
    ]),
    queryFn: () => checklistDefinitionApi.getChecklistDefinitionVersions(defId),
    select: (response) => response.versions,
  });
}

export function useGetChecklistDefinitionFromCentralRepo(
  repositoryID: number,
  repositoryVersion: number,
  isCoreChecklist: boolean,
) {
  const repoApi = useChecklistDefinitionCentralRepoApi();
  return useSuspenseQuery({
    queryKey: checklistDefinitionCentralRepoApiQueryKey([
      "getChecklistDefinitionFromCentralRepo",
      { repositoryID, repositoryVersion, isCoreChecklist },
    ]),
    queryFn: () =>
      repoApi.getChecklistDefinitionFromCentralRepo(
        repositoryID,
        repositoryVersion,
        isCoreChecklist,
      ),
  });
}

export function useGetNewestChecklistDefinitionsFromCentralRepo() {
  const repoApi = useChecklistDefinitionCentralRepoApi();
  return useSuspenseQuery({
    queryKey: checklistDefinitionCentralRepoApiQueryKey([
      "getNewestChecklistDefinitionsFromCentralRepo",
    ]),
    queryFn: () => repoApi.getNewestChecklistDefinitionsFromCentralRepo(),
    select: (response) => response.cldCentralRepoMetadata,
  });
}
