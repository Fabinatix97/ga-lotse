/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PaginatedList<TEntity> {
  elements: TEntity[];
  totalNumberOfElements: number;
}

export function mapPaginatedList<TInputElement, TOutputElement>(
  mapElement: (element: TInputElement) => TOutputElement,
) {
  return function listMapper(list: PaginatedList<TInputElement>) {
    return {
      elements: list.elements.map(mapElement),
      totalNumberOfElements: list.totalNumberOfElements,
    };
  };
}
