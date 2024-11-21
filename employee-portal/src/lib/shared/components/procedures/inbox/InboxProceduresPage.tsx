/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ApiBaseFeature } from "@eshg/employee-portal-api/base";
import { ApiProcedureType } from "@eshg/employee-portal-api/businessProcedures";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

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

import { InboxProcedureDetailsSidebar } from "./InboxProcedureDetailsSidebar";
import { UseCreateInboxProcedure } from "./hooks/useCreateInboxProcedureStatusTemplate";

interface InboxProceduresPageProps {
  procedureTypes: ApiProcedureType[];
  useFetchInboxProcedure: UseFetchInboxProcedure;
  useFetchInboxProcedures: UseFetchInboxProcedures;
  useCloseInboxProcedure: UseCloseInboxProcedure;
  useCreateInboxProcedure?: UseCreateInboxProcedure;
  routes: InboxProceduresPageRoutes;
}

export interface InboxProceduresPageRoutes {
  index: string;
  details: (inboxProcedureId: string) => string;
  create?: (inboxProcedureId: string) => string;
}

export function InboxProceduresPage(props: InboxProceduresPageProps) {
  const { id: detailsInboxProcedureId } = useParams();
  const showDetailsSidebar = typeof detailsInboxProcedureId === "string";

  return (
    <InboxProceduresTablePage
      {...props}
      sidebar={
        showDetailsSidebar && (
          <InboxProcedureDetailsSidebar
            inboxProcedureId={detailsInboxProcedureId}
            useFetchInboxProcedure={props.useFetchInboxProcedure}
            useCloseInboxProcedure={props.useCloseInboxProcedure}
            useCreateInboxProcedure={props.useCreateInboxProcedure}
            routes={props.routes}
          />
        )
      }
    />
  );
}

interface InboxProceduresTablePageProps {
  procedureTypes: ApiProcedureType[];
  useFetchInboxProcedures: UseFetchInboxProcedures;
  routes: InboxProceduresPageRoutes;
  sidebar: ReactNode;
}

export function InboxProceduresTablePage(props: InboxProceduresTablePageProps) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Posteingang" />}>
      <MainContentLayout>
        <ToggledPage2
          feature1={ApiBaseFeature.Inbox}
          feature2={ApiBaseFeature.InspectionInbox}
        >
          <InboxProceduresTable
            procedureTypes={props.procedureTypes}
            useFetchInboxProcedures={props.useFetchInboxProcedures}
            routes={props.routes}
          />
          {props.sidebar}
        </ToggledPage2>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
