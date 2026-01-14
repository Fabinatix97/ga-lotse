/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useQuery } from "@tanstack/react-query";

import { STATIC_QUERY_OPTIONS } from "@eshg/lib-portal";

import { useStiProtectionProcedureApi } from "@/lib/businessModules/stiProtection/api/clients";

export function usePinCheck(procedureId: string, pin: string | undefined) {
  const api = useStiProtectionProcedureApi();
  return useQuery({
    queryFn: async ({ signal }) => {
      if (pin === undefined) {
        throw Error("Pin not defined");
      }
      return api
        .verifyAnonymousUserPin(procedureId, { pin }, { signal })
        .then(() => true) // 200 -> Success
        .catch(() => false); // Anything else -> Incorrect PIN
    },
    queryKey: ["pin-validation", procedureId, pin],
    enabled: pin !== undefined,
    ...STATIC_QUERY_OPTIONS,
  });
}
