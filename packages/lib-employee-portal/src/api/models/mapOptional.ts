/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function mapOptional<TResponse, TModel>(
  response: TResponse | undefined,
  mapper: (response: TResponse) => TModel,
) {
  if (response === undefined) {
    return undefined;
  }

  return mapper(response);
}
