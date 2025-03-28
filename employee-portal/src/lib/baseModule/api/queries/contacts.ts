/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetContactHistoryRequest, GetContactsRequest } from "@eshg/base-api";
import { Contact } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

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

export function useGetContactQuery(id: string) {
  const contactApi = useContactApi();
  return useSuspenseQuery({
    queryKey: contactApiQueryKey(["getContact", id]),
    queryFn: async (): Promise<Contact> => await contactApi.getContact(id),
  });
}

export function useGetContactHistoryQuery(request: GetContactHistoryRequest) {
  const contactApi = useContactApi();
  return useSuspenseQuery({
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
