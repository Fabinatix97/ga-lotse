/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UseFilterSettings,
  UseFilterSettingsParams,
  useFilterSettings,
} from "./useFilterSettings";
import { useSearchParamStateProvider } from "./useSearchParamStateProvider";

type UseSearchParamFilterSettingsParams = Omit<
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
