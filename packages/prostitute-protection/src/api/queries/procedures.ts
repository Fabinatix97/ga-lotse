/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  PaginationProps,
  TableSortingProps,
  getSortDirection,
  getSortKey,
} from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";
import {
  ApiProstitutionProtectionProcedureSortKey,
  GetProceduresRequest,
} from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

import { proceduresQueryKey } from "./apiQueryKeys";

type PageRequest = Pick<PaginationProps, "pageSize" | "pageNumber">;

const SortByMap: Record<string, ApiProstitutionProtectionProcedureSortKey> = {
  alias: ApiProstitutionProtectionProcedureSortKey.Alias,
  appointmentStart: ApiProstitutionProtectionProcedureSortKey.AppointmentStart,
};

export function useProceduresQueryOptions({
  page,
  sorting,
  alias,
}: {
  page: PageRequest;
  sorting: TableSortingProps;
  alias?: string;
}) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const sortKey = getSortKey(sorting, SortByMap);

  const request: GetProceduresRequest = {
    pageNumber: page.pageNumber,
    pageSize: page.pageSize,
    sortKey,
    sortDirection: getSortDirection(sorting),
    alias,
  };

  return queryOptions({
    queryFn: () =>
      prostituteProtectionApi.getProceduresRaw(request).then(unwrapRawResponse),
    queryKey: proceduresQueryKey(["list", request]),
  });
}

export function useGetProcedureOptions(procedureId: string) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  return queryOptions({
    queryFn: () => prostituteProtectionApi.getProcedure(procedureId),
    queryKey: proceduresQueryKey([procedureId, "details"]),
  });
}

export function useGetProcedure(procedureId: string) {
  const options = useGetProcedureOptions(procedureId);
  return useSuspenseQuery(options);
}
