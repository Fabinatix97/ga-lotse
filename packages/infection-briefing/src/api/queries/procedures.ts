/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { queryOptions } from "@tanstack/react-query";
import { isNonNullish } from "remeda";

import {
  ApiProcedureStatus,
  GetInfectionBriefingProceduresRequest,
} from "@eshg/infection-briefing-api";
import { PaginationProps, PersonSearchParams } from "@eshg/lib-employee-portal";
import { mapOptionalValue, unwrapRawResponse } from "@eshg/lib-portal";

import { ProcedureFilters } from "../../components/procedures/proceduresTable/InfectionBriefingProceduresTableFilters";
import { useInfectionBriefingApiClients } from "../../contexts/InfectionBriefingApi";

import { proceduresQueryKey } from "./apiQueryKeys";

type PageRequest = Pick<
  PaginationProps,
  "pageSize" | "pageNumber" | "pageSizeOptions"
>;

export function useProceduresQueryOptions({
  page,
  filters,
  search,
}: {
  page: PageRequest;
  filters: ProcedureFilters;
  search: PersonSearchParams;
}) {
  const { infectionBriefingProcedureApi } = useInfectionBriefingApiClients();

  const request: GetInfectionBriefingProceduresRequest = {
    instructionType: filters.appointmentType,
    instructionYear: filters.appointmentYear?.toString(),
    status: isNonNullish(filters.statuses)
      ? Array.from(filters.statuses)
      : Object.values(ApiProcedureStatus),
    pageNumber: page.pageNumber,
    pageSize: page.pageSize,
    searchDateOfBirth: search.searchDateOfBirth,
    searchFirstName: mapOptionalValue(search.searchFirstName),
    searchLastName: mapOptionalValue(search.searchLastName),
  };

  return queryOptions({
    queryFn: ({ signal }) =>
      infectionBriefingProcedureApi
        .getInfectionBriefingProceduresRaw(request, { signal })
        .then(unwrapRawResponse),

    queryKey: proceduresQueryKey(["list", { request }]),
  });
}
