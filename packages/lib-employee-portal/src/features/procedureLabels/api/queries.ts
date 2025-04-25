/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

import { mapProcedureLabels } from "@/features/procedureLabels/api/models/ProcedureLabel";
import { ProcedureLabelClient } from "@/features/procedureLabels/types/procedureLabelClient";

export function useGetProcedureLabels(
  procedureLabelApi: ProcedureLabelClient,
  procedureLabelApiQueryKey: QueryKeyFactory,
) {
  return useSuspenseQuery({
    queryKey: procedureLabelApiQueryKey(["getLabels"]),
    queryFn: () => procedureLabelApi.getLabels(),
    select: (response) => mapProcedureLabels(response.labels),
  });
}
