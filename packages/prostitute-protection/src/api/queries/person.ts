/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import {
  PaginationProps,
  TableSortingProps,
  getSortDirection,
  getSortKey,
} from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";
import {
  ApiProstituteProtectionProcedurePersonSearchParameters,
  ApiProstitutionProtectionProcedureSortKey,
  PersonSearchRequest,
} from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

import { personQueryKey } from "./apiQueryKeys";

type PageRequest = Pick<PaginationProps, "pageSize" | "pageNumber">;

const SortByMap: Record<string, ApiProstitutionProtectionProcedureSortKey> = {
  id: ApiProstitutionProtectionProcedureSortKey.Id,
  appointmentStart: ApiProstitutionProtectionProcedureSortKey.AppointmentStart,
  alias: ApiProstitutionProtectionProcedureSortKey.Alias,
};

export interface UsePersonSearchParams {
  search?: ApiProstituteProtectionProcedurePersonSearchParameters;
  page?: PageRequest;
  sorting?: TableSortingProps;
}

export function usePersonSearchOptions({
  search,
  page,
  sorting,
}: UsePersonSearchParams) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();

  const isSearchValid = Boolean(
    search?.firstName && search?.lastName && search?.dateOfBirth,
  );

  const request: PersonSearchRequest = {
    apiProstituteProtectionProcedurePersonSearchParameters:
      search ?? ({} as ApiProstituteProtectionProcedurePersonSearchParameters),
    pageNumber: page?.pageNumber,
    pageSize: page?.pageSize,
    sortKey: sorting ? getSortKey(sorting, SortByMap) : undefined,
    sortDirection: sorting ? getSortDirection(sorting) : undefined,
  };

  return queryOptions({
    queryFn: () =>
      prostituteProtectionApi.personSearchRaw(request).then(unwrapRawResponse),
    queryKey: personQueryKey(["list", request]),
    enabled: isSearchValid,
    throwOnError: true,
  });
}
