/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useQuery } from "@tanstack/react-query";

import { useStiProtectionProcedureApi } from "@/lib/businessModules/stiProtection/api/clients";

export function usePinCheck(procedureId: string, pin: string | undefined) {
  const api = useStiProtectionProcedureApi();
  return useQuery({
    queryFn: async ({ signal }) => {
      if (pin == null) {
        throw Error("Pin not defined");
      }
      return api
        .verifyAnonymousUserPin(procedureId, { pin }, { signal })
        .then(() => true) // 200 -> Success
        .catch(() => false); // Anything else -> Incorrect PIN
    },
    queryKey: ["pin-validation", procedureId, pin],
    enabled: pin != null,
  });
}
