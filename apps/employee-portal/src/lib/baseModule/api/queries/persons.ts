/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { usePersonApi } from "@/lib/baseModule/api/clients";
import { personApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useGetPersonFileStateDiff(id: string) {
  const personApi = usePersonApi();
  return useSuspenseQuery({
    queryKey: personApiQueryKey(["getPersonFileStateDiff", id]),
    queryFn: () => personApi.getPersonDiff(id),
  });
}
