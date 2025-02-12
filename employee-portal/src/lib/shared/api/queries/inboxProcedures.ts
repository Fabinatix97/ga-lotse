/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { type QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { InboxProcedureApi } from "@eshg/lib-procedures-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

type UseFetchInboxProceduresResult = ReturnType<
  typeof useFetchInboxProceduresTemplate
>;
export type UseFetchInboxProcedures = () => UseFetchInboxProceduresResult;

export function useFetchInboxProceduresTemplate(
  useInboxProcedureApi: () => Pick<InboxProcedureApi, "getInboxProceduresRaw">,
  queryKeyFactory: QueryKeyFactory,
) {
  const inboxProcedureApi = useInboxProcedureApi();
  const searchParams = Object.fromEntries(useSearchParams().entries());
  return useSuspenseQuery({
    queryKey: queryKeyFactory(["fetchInboxProcedures", searchParams]),
    queryFn: async () => {
      const response =
        await inboxProcedureApi.getInboxProceduresRaw(searchParams);
      return await response.value();
    },
  });
}

type UseFetchInboxProcedureResult = ReturnType<
  typeof useFetchInboxProcedureTemplate
>;
export type UseFetchInboxProcedure = (
  inboxProcedureId: string,
) => UseFetchInboxProcedureResult;

export function useFetchInboxProcedureTemplate(
  useInboxProcedureApi: () => Pick<InboxProcedureApi, "getInboxProcedure">,
  queryKeyFactory: QueryKeyFactory,
  inboxProcedureId: string,
) {
  const inboxProcedureApi = useInboxProcedureApi();
  return useSuspenseQuery({
    queryKey: queryKeyFactory(["getInboxProcedure", inboxProcedureId]),
    queryFn: async () => {
      return await inboxProcedureApi.getInboxProcedure(inboxProcedureId);
    },
  });
}
