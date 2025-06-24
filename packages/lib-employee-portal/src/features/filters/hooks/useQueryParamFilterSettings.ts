/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UseFilterSettings,
  UseFilterSettingsParams,
  useFilterSettings,
} from "./useFilterSettings";
import { useQueryParamStateProvider } from "./useQueryParamStateProvider";

type UseSearchParamFilterSettingsParams = Omit<
  UseFilterSettingsParams,
  "stateProvider"
>;

export function useQueryParamFilterSettings(
  params: UseSearchParamFilterSettingsParams,
): UseFilterSettings {
  const searchParamStateProvider = useQueryParamStateProvider(
    params.definitions,
  );

  return useFilterSettings({
    ...params,
    stateProvider: searchParamStateProvider,
  });
}
