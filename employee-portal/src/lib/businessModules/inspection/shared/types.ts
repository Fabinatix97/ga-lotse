/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as v from "valibot";

import {
  ApiWebSearchEntryStatus,
  GetPendingFacilitiesRequest,
} from "@eshg/inspection-api";
import {
  BooleanSchema,
  PositiveIntegerSchema,
} from "@eshg/lib-portal/universal";

export const FacilityWebSearchFiltersSchema = v.partial(
  v.object({
    pageNumber: PositiveIntegerSchema,
    pageSize: PositiveIntegerSchema,
    name: v.string(),
    address: v.string(),
    status: v.enum(ApiWebSearchEntryStatus),
    keywords: v.string(),
    ignored: BooleanSchema,
    sortField: v.string(),
    sortDirection: v.string(),
  }),
);
export type FacilityWebSearchFiltersSchema = v.InferOutput<
  typeof FacilityWebSearchFiltersSchema
>;

export type PendingFacilitiesFilters = Partial<
  Omit<GetPendingFacilitiesRequest, "sort" | "isBefore" | "isAfter">
> & {
  sortField?: string;
  sortDirection?: string;
  isBefore?: string;
  isAfter?: string;
};
