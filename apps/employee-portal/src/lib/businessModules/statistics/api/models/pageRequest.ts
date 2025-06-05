/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface PageRequest {
  page: number;
  pageSize: number;
  sortDirection: "ASC" | "DESC" | undefined;
  sortKey: string | undefined;
}

export function mapPageRequest<ApiSortKey>(
  pageRequest: PageRequest,
  sortKeyMapper: (sortKey: string | undefined) => ApiSortKey | undefined,
) {
  return {
    ...pageRequest,
    sortKey: sortKeyMapper(pageRequest.sortKey),
  };
}
