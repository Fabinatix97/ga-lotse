/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ApiProcedureType } from "@eshg/lib-procedures-api";

import {
  UseFetchInboxProcedure,
  UseFetchInboxProcedures,
} from "@/lib/shared/api/queries/inboxProcedures";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
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
