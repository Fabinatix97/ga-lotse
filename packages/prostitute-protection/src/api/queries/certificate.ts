/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

import { proceduresQueryKey } from "./apiQueryKeys";

export function useCertificatesQueryOptions(procedureId: string) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();

  return queryOptions({
    queryFn: () => prostituteProtectionApi.getCertificates(procedureId),
    queryKey: proceduresQueryKey([procedureId, "certificates"]),
    select: (data) => data.encryptedFiles,
  });
}
