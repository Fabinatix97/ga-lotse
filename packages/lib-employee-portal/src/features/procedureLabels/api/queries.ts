/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryOptions } from "@tanstack/react-query";

import { QueryKeyFactory } from "@eshg/lib-portal";

import { ProcedureLabelClient } from "../types/procedureLabelClient";

import { mapProcedureLabels } from "./models/ProcedureLabel";

export function useGetProcedureLabelsQuery(
  procedureLabelApi: ProcedureLabelClient,
  procedureLabelApiQueryKey: QueryKeyFactory,
) {
  return queryOptions({
    queryKey: procedureLabelApiQueryKey(["getLabels"]),
    queryFn: () => procedureLabelApi.getLabels(),
    select: (response) => mapProcedureLabels(response.labels),
  });
}
