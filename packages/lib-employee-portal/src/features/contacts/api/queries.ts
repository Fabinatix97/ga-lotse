/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiContactCategory,
  ApiContactSortKey,
  ApiSearchContactsResponse,
  GetContactsRequest,
} from "@eshg/base-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { contactApiQueryKey } from "@/config/apiQueryKeys";
import { useApi } from "@/contexts/api";
import { Contact } from "@/features/contacts/api/models/Contact";

export function useGetOptionalContactQuery(id?: string) {
  const { contactApi } = useApi();

  return useQuery({
    queryKey: contactApiQueryKey(["getContact", id]),
    queryFn: async (): Promise<Contact> => {
      if (id === undefined) {
        throw Error("Query must only be enabled if id is defined.");
      }
      return await contactApi.getContact(id);
    },
    enabled: id !== undefined,
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
  const { contactApi } = useApi();

  return useQuery({
    queryKey: contactApiQueryKey(["getContacts", request]),
    queryFn: () => contactApi.getContactsRaw(request).then(unwrapRawResponse),
    placeholderData: keepPreviousData,
    select: (response) =>
      options?.enabled ? response : EMPTY_SEARCH_CONTACTS_RESPONSE,
    enabled: options?.enabled,
  });
}

export function useSearchContacts(
  contactName: string,
  contactCategories: Set<ApiContactCategory>,
) {
  const [debouncedName] = useDebounce(contactName, 250, {
    trailing: true,
  });

  return useSearchContactsQuery(
    {
      name: debouncedName,
      categories: contactCategories,
      sortKey: ApiContactSortKey.Relevance,
    },
    { enabled: debouncedName.length >= 1 },
  );
}
