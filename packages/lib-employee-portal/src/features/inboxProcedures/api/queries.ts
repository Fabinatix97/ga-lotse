/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { unwrapRawResponse } from "@eshg/lib-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { inboxProcedureApiQueryKey } from "../../../config/apiQueryKeys";

import { InboxProcedureClient } from "./client";

export function useFetchInboxProcedures(
  inboxProcedureApi: InboxProcedureClient,
  businessModule: ApiBusinessModule,
) {
  const searchParams = Object.fromEntries(useSearchParams().entries());
  return useSuspenseQuery({
    queryKey: inboxProcedureApiQueryKey([
      "getInboxProcedures",
      businessModule,
      searchParams,
    ]),
    queryFn: () =>
      inboxProcedureApi
        .getInboxProceduresRaw(searchParams)
        .then(unwrapRawResponse),
  });
}

export function useFetchInboxProcedure(
  inboxProcedureApi: InboxProcedureClient,
  businessModule: ApiBusinessModule,
  inboxProcedureId: string,
) {
  return useSuspenseQuery({
    queryKey: inboxProcedureApiQueryKey([
      "getInboxProcedure",
      businessModule,
      inboxProcedureId,
    ]),
    queryFn: () => inboxProcedureApi.getInboxProcedure(inboxProcedureId),
  });
}
