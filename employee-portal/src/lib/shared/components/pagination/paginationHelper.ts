/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function getLastPage(pageSize: number, totalCount: number) {
  return Math.max(0, Math.ceil(totalCount / pageSize - 1));
}

export function getCurrentCountText(
  pageNumber: number,
  pageSize: number,
  totalCount: number,
) {
  const isOverflow = pageNumber > 0 && pageNumber * pageSize >= totalCount;
  if (isOverflow) return "---";
  const from = Math.min(pageNumber * pageSize + 1, totalCount);
  const to = Math.min((pageNumber + 1) * pageSize, totalCount);
  const isOnlyOnePage = pageNumber === 0 && to === totalCount;
  return to === from || isOnlyOnePage ? `${to}` : `${from} - ${to}`;
}

export const defaultPageSizeOptions = [10, 25, 50];
export const defaultPageSize = 25;

export function getPageSizeOptions(limitOptions: number[], labelText: string) {
  return limitOptions.map((option) => ({
    value: `${option}`,
    label: `${option}${labelText}`,
  }));
}
