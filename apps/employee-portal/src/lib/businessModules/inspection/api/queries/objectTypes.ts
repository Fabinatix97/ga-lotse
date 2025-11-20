/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { ObjectTypeApi } from "@eshg/inspection-api";
import { STATIC_QUERY_OPTIONS } from "@eshg/lib-portal";

import { useObjectTypeApi } from "@/lib/businessModules/inspection/api/clients";
import { objectTypeApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function useGetObjectTypes() {
  const objectTypeApi = useObjectTypeApi();
  return useSuspenseQuery(getObjectTypesQuery(objectTypeApi));
}

export function useGetObjectTypeHierarchyTree() {
  const objectTypeHierarchyTreeApi = useObjectTypeApi();
  return useSuspenseQuery(
    getObjectTypesHierarchyTree(objectTypeHierarchyTreeApi),
  );
}

function getObjectTypesHierarchyTree(objectTypeApi: ObjectTypeApi) {
  return queryOptions({
    queryKey: objectTypeApiQueryKey(["getObjectTypesHierarchy"]),
    queryFn: () => objectTypeApi.getObjectTypesHierarchy(),
    select: (response) => response.root.subNodes ?? [],
  });
}

export function getObjectTypesQuery(objectTypeApi: ObjectTypeApi) {
  return queryOptions({
    queryKey: objectTypeApiQueryKey(["getObjectTypes"]),
    queryFn: () => objectTypeApi.getObjectTypes(),
    select: (response) => response.objectTypes ?? [],
    // Enable long-time caching for this query, but do not make this query static,
    // i.e. don't disable the invalidation through mutation.
    gcTime: STATIC_QUERY_OPTIONS.gcTime,
    staleTime: STATIC_QUERY_OPTIONS.staleTime,
  });
}
