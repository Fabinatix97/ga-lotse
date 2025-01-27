/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiErrorCode } from "@eshg/base-api";
import { resolveError } from "@eshg/lib-portal/errorHandling/errorResolvers";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useMukFacilityLinkApi } from "@/lib/baseModule/api/clients";
import { mukFacilityLinkApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKeys";

export function useGetLinkedReferenceFacility() {
  const mukApi = useMukFacilityLinkApi();
  return useSuspenseQuery({
    queryKey: mukFacilityLinkApiQueryKey([
      "getReferenceFacilityLinkedToMukSelfUser",
    ]),
    queryFn: async () => {
      try {
        return await mukApi.getReferenceFacilityLinkedToMukSelfUser();
      } catch (e: unknown) {
        const resolvedError = resolveError(e);
        if (resolvedError.errorCode === ApiErrorCode.NotFound) {
          return "not found";
        }
        throw e;
      }
    },
  });
}
