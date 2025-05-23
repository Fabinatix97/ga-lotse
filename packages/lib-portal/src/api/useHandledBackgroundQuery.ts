/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DefaultError,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";

import { useSnackbar } from "../components/snackbar/SnackbarProvider";
import { getErrorMessage } from "../errorHandling/errorMappers";
import { resolveError } from "../errorHandling/errorResolvers";

/**
 * Use query with snackbar error handling
 *
 * This hook disables `throwOnError` and instead reports errors using the snackbar.
 * It should only be used for background queries like loading search results when typing
 * which should not trigger the next error boundary on error.
 */
export function useHandledBackgroundQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
  const snackbar = useSnackbar();
  const queryResult = useQuery({ ...options, throwOnError: false });
  const error = queryResult.error;

  useEffect(() => {
    if (error !== null) {
      const resolvedError = resolveError(error);
      const errorMessage = getErrorMessage(resolvedError.errorCode);
      snackbar.error(errorMessage);
    }
  }, [error, snackbar]);

  return queryResult;
}
