/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DefaultError,
  UseMutationOptions,
  useMutation,
} from "@tanstack/react-query";

import { useAlertContext } from "../errorHandling/AlertContext";
import {
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
  const alertContext = useAlertContext();

  return useMutation({
    ...options,
    onError: runBefore(options.onError, (error) => {
      const { errorCode } = resolveError(error);
      const { title, message } = getErrorDescription(errorCode);

      if (alertContext === null) {
        throw new Error("No alert context available.");
      }

      alertContext.setAlert({
        color: "danger",
        title,
        message,
        action: getErrorAction(errorCode),
      });
    }),
    onSuccess: runBefore(options.onSuccess, () => {
      if (alertContext !== null) {
        alertContext.setAlert(null); // we might need to add a key later on to only reset errors from this mutation
      }
    }),
  });
}

function runBefore<const TParams extends unknown[]>(
  handler: ((...params: TParams) => unknown) | undefined,
  beforeHandler: (...params: TParams) => unknown,
) {
  return (...params: TParams) => {
    beforeHandler(...params);
    if (handler !== undefined) {
      handler(...params);
    }
  };
}
