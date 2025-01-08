/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiBusinessModule } from "@eshg/citizen-portal-api/base";
import { useCallback } from "react";

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
