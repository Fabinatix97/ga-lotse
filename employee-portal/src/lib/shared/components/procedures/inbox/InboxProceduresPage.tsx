/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ApiBaseFeature } from "@eshg/employee-portal-api/base";
import { ApiProcedureType } from "@eshg/employee-portal-api/businessProcedures";

import {
  UseFetchInboxProcedure,
  UseFetchInboxProcedures,
} from "@/lib/shared/api/queries/inboxProcedures";
import { ToggledPage2 } from "@/lib/shared/components/ToggledPage";
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
        <ToggledPage2
          feature1={ApiBaseFeature.Inbox}
          feature2={ApiBaseFeature.InspectionInbox}
        >
          <InboxProceduresTable {...props} />
        </ToggledPage2>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
