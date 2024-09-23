/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiContactCategory,
  ApiSearchContactsResponse,
  GetContactHistoryRequest,
  GetContactsRequest,
} from "@eshg/employee-portal-api/base";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import {
  keepPreviousData,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { useContactApi } from "@/lib/baseModule/api/clients";
import { contactApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";
import { Contact } from "@/lib/baseModule/components/contacts/types";

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

const EMPTY_SEARCH_CONTACTS_RESPONSE: ApiSearchContactsResponse = {
  elements: [],
  totalNumberOfElements: 0,
};

export function useSearchContactsQuery(
  request: GetContactsRequest,
  options: { enabled?: boolean },
) {
  const contactApi = useContactApi();
  return useQuery({
    queryKey: contactApiQueryKey(["getContacts", request]),
    queryFn: () => contactApi.getContactsRaw(request).then(unwrapRawResponse),
    placeholderData: keepPreviousData,
    select: (response) =>
      options?.enabled ? response : EMPTY_SEARCH_CONTACTS_RESPONSE,
    enabled: options?.enabled,
  });
}

export function useSearchSchools(schoolName: string) {
  const [debouncedSchoolName] = useDebounce(schoolName, 250, {
    trailing: true,
  });
  return useSearchContactsQuery(
    { name: debouncedSchoolName, category: ApiContactCategory.School },
    { enabled: debouncedSchoolName.length >= 1 },
  );
}

export function useSearchContacts(
  contactName: string,
  contactCategory: ApiContactCategory,
) {
  const [debouncedName] = useDebounce(contactName, 250, {
    trailing: true,
  });
  return useSearchContactsQuery(
    { name: debouncedName, category: contactCategory },
    { enabled: debouncedName.length >= 1 },
  );
}
