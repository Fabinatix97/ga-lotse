/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SearchParamValue,
  parseOptionalBoundedInt,
} from "@eshg/lib-portal/universal";

export const SEARCH_PARAMS = {
  pageNumber: "page",
  search: "search",
  topic: "topic",
  year: "year",
  fileType: "fileType",
} as const;

export function parseYear(year: SearchParamValue) {
  const parsedYear = parseOptionalBoundedInt(year, 1000, 9999);
  return parsedYear !== undefined ? `${parsedYear}` : undefined;
}
