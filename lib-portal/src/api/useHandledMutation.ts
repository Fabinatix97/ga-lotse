/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from "@tanstack/react-query";

import { useAlert } from "../errorHandling/AlertContext";
import {
  getCloseable,
  getErrorAction,
  getErrorDescription,
} from "../errorHandling/errorMappers";
import { resolveError } from "../errorHandling/errorResolvers";

/**
 * Use mutation with default error handling
 *
 * This hook should - in general - be used over useMutation.
 * If you want to do error handling on your own, use useMutation directly.
 */
export function useHandledMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  const alert = useAlert();

  return useMutation({
    ...options,
    onError: runBefore(options.onError, (error) => {
      const { errorCode } = resolveError(error);
      const { title, message } = getErrorDescription(errorCode);

      alert.error({
        title,
        message,
        action: getErrorAction(errorCode),
        closeable: getCloseable(errorCode),
      });
    }),
    onMutate: runBefore(options.onMutate, () => {
      alert.close();
    }),
  });
}

function runBefore<const TParams extends unknown[]>(
  handler: ((...params: TParams) => unknown) | undefined,
  beforeHandler: (...params: TParams) => unknown,
) {
  return (...params: TParams): undefined => {
    beforeHandler(...params);
    if (handler !== undefined) {
      handler(...params);
    }
  };
}
