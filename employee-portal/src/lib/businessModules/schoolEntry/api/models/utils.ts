/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
