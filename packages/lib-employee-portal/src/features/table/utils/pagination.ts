/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

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

export function getPageSizeOptions(limitOptions: number[], labelText: string) {
  return limitOptions.map((option) => ({
    value: `${option}`,
    label: `${option}${labelText}`,
  }));
}
