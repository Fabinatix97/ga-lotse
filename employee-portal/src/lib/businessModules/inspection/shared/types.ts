/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  GetPendingFacilitiesRequest,
  SearchRequest,
} from "@eshg/employee-portal-api/inspection";

export type FacilityWebSearchFilters = Partial<Omit<SearchRequest, "sort">> & {
  sortField?: string;
  sortDirection?: string;
};

export type PendingFacilitiesFilters = Partial<
  Omit<GetPendingFacilitiesRequest, "sort" | "isBefore" | "isAfter">
> & {
  sortField?: string;
  sortDirection?: string;
  isBefore?: string;
  isAfter?: string;
};
