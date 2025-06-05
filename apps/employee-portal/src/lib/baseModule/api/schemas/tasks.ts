/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as v from "valibot";

import { PositiveIntegerSchema } from "@eshg/lib-portal/universal";

export const FetchTaskForOverviewSearchParamsSchema = v.partial(
  v.object({
    sortField: v.string(),
    sortDirection: v.string(),
    pageSize: PositiveIntegerSchema,
    pageNumber: PositiveIntegerSchema,
  }),
);
export type FetchTaskForOverviewSearchParamsSchema = v.InferOutput<
  typeof FetchTaskForOverviewSearchParamsSchema
>;
