/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { ApiErrorCode } from "@eshg/base-api";
import { resolveError } from "@eshg/lib-portal";

import { useBundIdPersonLinkApi } from "@/lib/baseModule/api/clients";
import { bundIdPersonLinkApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKeys";

export function useGetLinkedReferencePerson() {
  const bundIdApi = useBundIdPersonLinkApi();
  return useSuspenseQuery({
    queryKey: bundIdPersonLinkApiQueryKey([
      "getReferencePersonLinkedToBundIdSelfUser",
    ]),
    queryFn: async () => {
      try {
        return await bundIdApi.getReferencePersonLinkedToBundIdSelfUser();
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
