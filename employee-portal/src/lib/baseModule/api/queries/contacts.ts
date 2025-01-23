/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiContactCategory,
  ApiContactSortKey,
  ApiSearchContactsResponse,
  GetContactHistoryRequest,
  GetContactsRequest,
} from "@eshg/base-api";
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

export function useGetOptionalContact(id?: string) {
  const contactApi = useContactApi();
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

export const SCHOOL_OR_DAYCARE = new Set<ApiContactCategory>([
  ApiContactCategory.School,
  ApiContactCategory.Daycare,
]);

export function useSearchSchoolOrDaycare(institutionName: string) {
  const [debouncedInstitutionName] = useDebounce(
    institutionName,
    institutionName === "" ? 0 : 250,
    {
      trailing: true,
    },
  );

  return useSearchContactsQuery(
    {
      name: debouncedInstitutionName,
      categories: SCHOOL_OR_DAYCARE,
      sortKey: ApiContactSortKey.Relevance,
    },
    { enabled: debouncedInstitutionName.length >= 1 },
  );
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
