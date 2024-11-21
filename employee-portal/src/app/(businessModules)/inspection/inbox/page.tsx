/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  useCloseInboxProcedure,
  useCreateInboxProcedure,
} from "@/lib/businessModules/inspection/api/mutations/inbox";
import {
  useFetchInboxProcedure,
  useFetchInboxProcedures,
} from "@/lib/businessModules/inspection/api/queries/inboxProcedures";
import { procedureTypes } from "@/lib/businessModules/inspection/shared/constants";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { InboxProceduresPage } from "@/lib/shared/components/procedures/inbox/InboxProceduresPage";

export default function InspectionInboxProceduresPage() {
  return (
    <InboxProceduresPage
      procedureTypes={procedureTypes}
      useFetchInboxProcedures={useFetchInboxProcedures}
      useFetchInboxProcedure={useFetchInboxProcedure}
      useCloseInboxProcedure={useCloseInboxProcedure}
      useCreateInboxProcedure={useCreateInboxProcedure}
      routes={routes.inbox}
    />
  );
}
