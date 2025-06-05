/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback } from "react";

import { ApiBusinessModule } from "@eshg/base-api";

import { useGetConfig } from "@/lib/shared/api/queries/publicConfig";

export function useHasBusinessModule(): (module: ApiBusinessModule) => boolean {
  const {
    data: { activeModules },
  } = useGetConfig();
  return useCallback(
    (module) => activeModules.includes(module),
    [activeModules],
  );
}
