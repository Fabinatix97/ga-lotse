/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryOptions } from "@tanstack/react-query";

import { QueryKeyFactory, unwrapRawResponse } from "@eshg/lib-portal";

import { mapPaginatedList } from "../../../api/models/PaginatedList";
import {
  GetProcedureLabelsRequest,
  ProcedureLabelClient,
} from "../types/procedureLabelClient";

import { mapProcedureLabel } from "./models/ProcedureLabel";

export function useGetProcedureLabelsQuery(
  procedureLabelApi: ProcedureLabelClient,
  procedureLabelApiQueryKey: QueryKeyFactory,
  request: GetProcedureLabelsRequest,
) {
  return queryOptions({
    queryKey: procedureLabelApiQueryKey(["getLabels", request]),
    queryFn: () =>
      procedureLabelApi.getLabelsRaw(request).then(unwrapRawResponse),
    select: mapPaginatedList(mapProcedureLabel),
  });
}
