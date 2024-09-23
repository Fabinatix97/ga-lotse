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
import { useState } from "react";

import { useGetContactsOverviewPageQuery } from "@/lib/baseModule/api/queries/contacts";
import { ContactsTable } from "@/lib/baseModule/components/contacts/ContactsTable";
import { AddInstitutionContactSidebar } from "@/lib/baseModule/components/contacts/modals/AddInstitutionContactSidebar";
import { AddPersonContactSidebar } from "@/lib/baseModule/components/contacts/modals/AddPersonContactSidebar";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import {
  PaginatedSearchParams,
  SortableSearchParams,
} from "@/lib/shared/helpers/searchParams";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

interface SidebarState {
  open: boolean;
  contactType: "AddInstitutionContactRequest" | "AddPersonContactRequest";
  flowStep: "IMPORT" | "SEARCH";
}

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
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    open: false,
    contactType: "AddPersonContactRequest",
    flowStep: "IMPORT",
  });

  const query = useGetContactsOverviewPageQuery(params);
  const response = query.isSuccess ? query.data : undefined;

  const { sidebarFormRef, closeSidebar, handleClose } = useSidebarForm({
    onClose: () => setSidebarState((state) => ({ ...state, open: false })),
  });

  return (
    <>
      <ContactsTable
        loading={query.isFetching}
        elements={response?.elements ?? []}
        totalNumberOfElements={response?.totalNumberOfElements ?? 0}
        onCreate={(type) =>
          setSidebarState({
            contactType: type,
            flowStep: "SEARCH",
            open: true,
          })
        }
        onImport={(type) =>
          setSidebarState({
            contactType: type,
            flowStep: "IMPORT",
            open: true,
          })
        }
      />

      <OverlayBoundary>
        <Sidebar open={sidebarState.open} onClose={handleClose}>
          {sidebarState.open &&
            (sidebarState.contactType === "AddPersonContactRequest" ? (
              <AddPersonContactSidebar
                onClose={handleClose}
                onSuccess={closeSidebar}
                flowStep={sidebarState.flowStep}
                sidebarFormRef={sidebarFormRef}
              />
            ) : (
              <AddInstitutionContactSidebar
                onClose={handleClose}
                onSuccess={closeSidebar}
                flowStep={sidebarState.flowStep}
                sidebarFormRef={sidebarFormRef}
              />
            ))}
        </Sidebar>
      </OverlayBoundary>
    </>
  );
}
