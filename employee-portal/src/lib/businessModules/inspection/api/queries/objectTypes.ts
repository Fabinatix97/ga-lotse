/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useObjectTypeApi } from "@/lib/businessModules/inspection/api/clients";
import { objectTypeApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function useGetObjectTypes() {
  const objectTypeApi = useObjectTypeApi();
  return useSuspenseQuery({
    queryKey: objectTypeApiQueryKey(["getObjectTypes"]),
    queryFn: () => objectTypeApi.getObjectTypes(),
    select: (response) => response.objectTypes ?? [],
  });
}
