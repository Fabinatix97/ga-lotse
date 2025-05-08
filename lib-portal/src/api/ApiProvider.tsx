/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  Mutation,
  MutationCache,
  Query,
  QueryClient,
  QueryClientProvider,
  QueryKey,
  matchQuery,
} from "@tanstack/react-query";
import { Suspense, createContext, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ConfigurationParameters } from "@eshg/base-api";

import { LoadingIndicator } from "../components/LoadingIndicator";
import { ErrorAlert } from "../errorHandling/ErrorAlert";
import { RequiresChildren } from "../types/react";

import { acceptLanguageMiddleware } from "./acceptLanguageMiddleware";
import { clientOnlyMiddleware } from "./clientOnlyMiddleware";
import { errorInterceptionMiddleware } from "./errorInterceptionMiddleware";

interface CustomQueryMeta extends Record<string, unknown> {
  /**
   * Marks the query as static, disabling automatic invalidation after any mutation.
   * Note: Only set this property for data which is changed rarely and cannot be changed by user interactions.
   */
  static?: true;
}

interface CustomMutationMeta extends Record<string, unknown> {
  /**
   * Relates the mutation to a query, disabling automatic invalidation for the specified query.
   * Note: The mutation must manually update the query cache on success.
   */
  updatesQuery?: QueryKey;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: CustomQueryMeta;
    mutationMeta: CustomMutationMeta;
  }
}

const isServer = typeof window === "undefined";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Disable caching on client, but keep default for server
       *
       * A gcTime below 1s is ignored for suspense queries to prevent infinite retries on failure.
       * @see https://github.com/TanStack/query/issues/7853
       */
      gcTime: isServer ? Infinity : 0,
      retry: false,
      throwOnError: true,
      networkMode: "offlineFirst",
    },
    mutations: {
      throwOnError: false,
      networkMode: "offlineFirst",
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation): void => {
      // invalidate active queries after a successful mutation
      // see https://tkdodo.eu/blog/automatic-query-invalidation-after-mutations
      void queryClient.invalidateQueries({
        predicate: (query): boolean =>
          !(isStaticQuery(query.meta) || matchesUpdatedQuery(query, mutation)),
      });
    },
  }),
});

function isStaticQuery(queryMeta: CustomQueryMeta | undefined): boolean {
  return queryMeta?.static ?? false;
}

function matchesUpdatedQuery(
  query: Query<unknown>,
  mutation: Mutation<unknown, unknown>,
): boolean {
  const { updatesQuery } = mutation.meta ?? {};

  if (updatesQuery === undefined) {
    return false;
  }

  return matchQuery({ queryKey: updatesQuery }, query);
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ApiConfiguration {}

const ApiConfigurationContext = createContext<ApiConfiguration>({});

interface ApiProviderProps extends RequiresChildren {
  configuration: ApiConfiguration;
}

export function ApiProvider(props: ApiProviderProps) {
  return (
    <ApiConfigurationContext value={props.configuration}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorAlert
              error={error as unknown}
              sx={{ margin: 3 }}
              onReset={resetErrorBoundary}
            />
          )}
        >
          <Suspense fallback={<LoadingIndicator height="100vh" />}>
            {props.children}
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    </ApiConfigurationContext>
  );
}

export function useApiConfiguration(
  basePathName: keyof ApiConfiguration,
  acceptLanguage: string,
): ConfigurationParameters {
  return {
    basePath: useConfigurationValue(basePathName),
    middleware: [
      clientOnlyMiddleware,
      errorInterceptionMiddleware,
      acceptLanguageMiddleware(acceptLanguage),
    ],
  };
}

function useConfigurationValue(key: keyof ApiConfiguration): string {
  const apiConfiguration = useContext(ApiConfigurationContext);
  const value = apiConfiguration[key];

  if (value === undefined) {
    throw new Error("Unknown key in ApiConfiguration");
  }

  return value;
}
