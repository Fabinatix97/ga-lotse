/**
 * Copyright 2025 cronn GmbH
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

interface AlertOptions {
  /**
   * Enables retrying the mutation from the alert after a recoverable error
   *
   * Use this option for mutations where the original trigger (e.g. a button)
   * is not available anymore when an error occurs.
   */
  enableRetryAfterError?: boolean;
  /**
   * Enables closing any error alert
   */
  closeable?: boolean;
}

interface UseHandledMutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
> extends UseMutationOptions<TData, TError, TVariables, TContext> {
  alertOptions?: AlertOptions;
}

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
>(options: UseHandledMutationOptions<TData, TError, TVariables, TContext>) {
  const { alertOptions, ...mutationOptions } = options;
  const alert = useAlert();

  const mutation = useMutation({
    ...mutationOptions,
    onMutate: runBefore(options.onMutate, () => {
      alert.close();
    }),
    onError: runBefore(options.onError, (error, variables) => {
      const { errorCode } = resolveError(error);
      const { title, message } = getErrorDescription(errorCode);
      const onReset =
        alertOptions?.enableRetryAfterError === true
          ? () => mutation.mutate(variables)
          : undefined;

      alert.error({
        title,
        message,
        action: getErrorAction(errorCode, onReset),
        closeable: alertOptions?.closeable ?? getCloseable(errorCode),
      });
    }),
  });

  return mutation;
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
