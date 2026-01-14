/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ApiBusinessModule, ApiProcedureType } from "@eshg/lib-procedures-api";

import { MainContentLayout } from "../../../components/layout/MainContentLayout";
import { StickyToolbarLayout } from "../../../components/layout/StickyToolbarLayout";
import { Toolbar } from "../../../components/toolbar/Toolbar";
import { InboxProcedureClient } from "../api/client";

import { InboxProceduresTable } from "./InboxProceduresTable";

export type CreateProcedureHandler = (inboxProcedureId: string) => void;

interface InboxProceduresPageProps {
  inboxProcedureApi: InboxProcedureClient;
  businessModule: ApiBusinessModule;
  procedureTypes: ApiProcedureType[];
  onCreateProcedure?: CreateProcedureHandler;
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
