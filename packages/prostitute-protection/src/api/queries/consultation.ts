/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

import { proceduresQueryKey } from "./apiQueryKeys";

export function useConsultationQueryOptions(procedureId: string) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();

  return queryOptions({
    queryFn: () => prostituteProtectionApi.getConsultation(procedureId),
    queryKey: proceduresQueryKey([procedureId, "consultation"]),
  });
}
