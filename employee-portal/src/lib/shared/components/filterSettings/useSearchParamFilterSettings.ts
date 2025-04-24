/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UseFilterSettings,
  UseFilterSettingsParams,
  useFilterSettings,
} from "@eshg/lib-employee-portal";

import { useSearchParamStateProvider } from "@/lib/shared/components/filterSettings/useSearchParamStateProvider";

export type UseSearchParamFilterSettingsParams = Omit<
  UseFilterSettingsParams,
  "stateProvider"
>;

export function useSearchParamFilterSettings(
  params: UseSearchParamFilterSettingsParams,
): UseFilterSettings {
  const searchParamStateProvider = useSearchParamStateProvider(
    params.definitions,
  );

  return useFilterSettings({
    ...params,
    stateProvider: searchParamStateProvider,
  });
}
