/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiContactCategory,
  ApiContactSortKey,
  ApiContactType,
} from "@eshg/employee-portal-api/base";

import { useGetContactsOverviewPageQuery } from "@/lib/baseModule/api/queries/contacts";
import { ContactsTable } from "@/lib/baseModule/components/contacts/ContactsTable";
import { useAddInstitutionContactSidebar } from "@/lib/baseModule/components/contacts/modals/AddInstitutionContactSidebar";
import { useAddPersonContactSidebar } from "@/lib/baseModule/components/contacts/modals/AddPersonContactSidebar";
import {
  PaginatedSearchParams,
  SortableSearchParams,
} from "@/lib/shared/helpers/searchParams";

export interface ContactOverviewSearchParams
  extends PaginatedSearchParams,
    SortableSearchParams<ApiContactSortKey> {
  type?: ApiContactType;
  name?: string;
  category?: ApiContactCategory;
}

export function ContactsOverview({
  params,
}: {
  params: ContactOverviewSearchParams;
}) {
  const query = useGetContactsOverviewPageQuery(params);
  const response = query.isSuccess ? query.data : undefined;

  const addInstitutionContactSidebar = useAddInstitutionContactSidebar();
  const addPersonContactSidebar = useAddPersonContactSidebar();

  return (
    <ContactsTable
      loading={query.isFetching}
      elements={response?.elements ?? []}
      totalNumberOfElements={response?.totalNumberOfElements ?? 0}
      onCreate={(type) => {
        if (type === "AddInstitutionContactRequest") {
          addInstitutionContactSidebar.open({
            flowStep: "SEARCH",
          });
        } else {
          addPersonContactSidebar.open({ flowStep: "SEARCH" });
        }
      }}
      onImport={(type) => {
        if (type === "AddInstitutionContactRequest") {
          addInstitutionContactSidebar.open({
            flowStep: "IMPORT",
          });
        } else {
          addPersonContactSidebar.open({ flowStep: "IMPORT" });
        }
      }}
    />
  );
}
