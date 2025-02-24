/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import { ApiProcedureType } from "@eshg/lib-procedures-api";

import {
  UseFetchInboxProcedure,
  UseFetchInboxProcedures,
} from "@/lib/shared/api/queries/inboxProcedures";
import { InboxProceduresTable } from "@/lib/shared/components/procedures/inbox/InboxProceduresTable";
import { UseCloseInboxProcedure } from "@/lib/shared/components/procedures/inbox/mutations/useCloseInboxProcedureStatusTemplate";

import { UseCreateInboxProcedure } from "./hooks/useCreateInboxProcedureStatusTemplate";

interface InboxProceduresPageProps {
  procedureTypes: ApiProcedureType[];
  useFetchInboxProcedure: UseFetchInboxProcedure;
  useFetchInboxProcedures: UseFetchInboxProcedures;
  useCloseInboxProcedure: UseCloseInboxProcedure;
  useCreateInboxProcedure?: UseCreateInboxProcedure;
}

export function InboxProceduresPage(props: InboxProceduresPageProps) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Posteingang" />}>
      <MainContentLayout>
        <InboxProceduresTable {...props} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
