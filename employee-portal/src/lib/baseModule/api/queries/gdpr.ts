/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetGdprProceduresRequest } from "@eshg/employee-portal-api/base";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useGdprProcedureApi } from "@/lib/baseModule/api/clients";
import { gdprProcedureApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useGetGdprProcedureDetailsPageQuery(id: string) {
  const gdprProcedureApi = useGdprProcedureApi();
  return useSuspenseQuery({
    queryKey: gdprProcedureApiQueryKey(["getGdprProcedureDetailsPage", id]),
    queryFn: () => gdprProcedureApi.getGdprProcedureDetailsPage(id),
  });
}

export function useGetGdprProcedureOverviewQuery(
  request: GetGdprProceduresRequest,
) {
  const gdprProcedureApi = useGdprProcedureApi();
  return useSuspenseQuery({
    queryKey: gdprProcedureApiQueryKey(["getGdprProcedures", request]),
    queryFn: () =>
      gdprProcedureApi.getGdprProceduresRaw(request).then(unwrapRawResponse),
  });
}
