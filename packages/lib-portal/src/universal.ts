/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Define universal exports here which may be used in both a client and server context
 */

export { defineRoutes } from "./helpers/routes";
export {
  type PaginatedSearchParams,
  type SearchParamValue,
  type SortableSearchParams,
  parseOptionalBoundedInt,
  parseOptionalEnum,
  parseOptionalInt,
  parseOptionalString,
  parseReadonlyPageParams,
} from "./helpers/searchParams";

export {
  DeploymentTypeSchema,
  EnvironmentTypeSchema,
  NodeEnvSchema,
  UrlSchema,
} from "./schemas/environment";
export {
  BooleanSchema,
  PositiveIntegerSchema,
  UuidSchema,
} from "./schemas/pageParams";
