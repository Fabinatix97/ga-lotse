/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

interface RawResponse<TData> {
  value(): Promise<TData>;
}

/**
 * Unwraps the response value when using the raw endpoint method of an API client
 */
export async function unwrapRawResponse<TData>(response: RawResponse<TData>) {
  return await response.value();
}
