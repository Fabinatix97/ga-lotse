/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { GetContactHistoryRequest, GetContactsRequest } from "@eshg/base-api";
import { unwrapRawResponse } from "@eshg/lib-portal";

import { useContactApi } from "@/lib/baseModule/api/clients";
import { contactApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useGetContactsOverviewPageQuery(request: GetContactsRequest) {
  const contactApi = useContactApi();
  return useSuspenseQuery({
    queryKey: contactApiQueryKey(["getContacts", request]),
    queryFn: async () => {
      return await contactApi.getContactsRaw(request).then(unwrapRawResponse);
    },
  });
}

export function useGetContactHistoryQueryOptions(
  request: GetContactHistoryRequest,
) {
  const contactApi = useContactApi();
  return queryOptions({
    queryKey: contactApiQueryKey(["getContactHistory", request]),
    queryFn: async () => {
      return await contactApi
        .getContactHistoryRaw(request)
        .then(unwrapRawResponse);
    },
  });
}

export function useGetContactHistoryStepQuery(request: {
  contactId: string;
  historyId: number;
}) {
  const contactApi = useContactApi();
  return useSuspenseQuery({
    queryKey: contactApiQueryKey(["getContactHistoryStep", request]),
    queryFn: async () => {
      return await contactApi.getContactHistoryStep(
        request.contactId,
        request.historyId,
      );
    },
  });
}

export function useGetContactAddressHistoryStepQuery(request: {
  contactId: string;
  addressId: number;
  historyId: number;
}) {
  const contactApi = useContactApi();
  return useSuspenseQuery({
    queryKey: contactApiQueryKey(["getContactAddressHistoryStep", request]),
    queryFn: async () => {
      return await contactApi.getContactAddressHistoryStep(
        request.contactId,
        request.addressId,
        request.historyId,
      );
    },
  });
}
