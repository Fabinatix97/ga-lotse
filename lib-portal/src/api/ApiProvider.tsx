/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ConfigurationParameters } from "@eshg/employee-portal-api/base";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Suspense, createContext, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { LoadingIndicator } from "../components/LoadingIndicator";
import { ErrorAlert } from "../errorHandling/ErrorAlert";
import { RequiresChildren } from "../types/react";

import { clientOnlyMiddleware } from "./clientOnlyMiddleware";
import { errorInterceptionMiddleware } from "./errorInterceptionMiddleware";

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
    onSuccess: () => {
      // invalidate active queries after a successful mutation
      // see https://tkdodo.eu/blog/automatic-query-invalidation-after-mutations
      void queryClient.invalidateQueries();
    },
  }),
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ApiConfiguration {}

const ApiConfigurationContext = createContext<ApiConfiguration>({});

interface ApiProviderProps extends RequiresChildren {
  configuration: ApiConfiguration;
}

export function ApiProvider(props: ApiProviderProps) {
  return (
    <ApiConfigurationContext.Provider value={props.configuration}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorAlert
              error={error as unknown}
              onReset={resetErrorBoundary}
              sx={{ margin: 3 }}
            />
          )}
        >
          <Suspense fallback={<LoadingIndicator height="100vh" />}>
            {props.children}
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    </ApiConfigurationContext.Provider>
  );
}

export function useApiConfiguration(
  basePathName: keyof ApiConfiguration,
): ConfigurationParameters {
  return {
    basePath: useConfigurationValue(basePathName),
    middleware: [clientOnlyMiddleware, errorInterceptionMiddleware],
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
