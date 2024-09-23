/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useCloseInboxProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/inbox";
import {
  useFetchInboxProcedure,
  useFetchInboxProcedures,
} from "@/lib/businessModules/schoolEntry/api/queries/inboxProcedures";
import { procedureTypes } from "@/lib/businessModules/schoolEntry/shared/constants";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { InboxProceduresPage } from "@/lib/shared/components/procedures/inbox/InboxProceduresPage";

export default function SchoolEntryInboxProceduresPage() {
  return (
    <InboxProceduresPage
      useFetchInboxProcedure={useFetchInboxProcedure}
      useFetchInboxProcedures={useFetchInboxProcedures}
      useCloseInboxProcedure={useCloseInboxProcedure}
      procedureTypes={procedureTypes}
      routes={{
        index: routes.inbox.overview,
        details: (inboxProcedureId: string) =>
          routes.inbox.byId(inboxProcedureId).details,
      }}
    />
  );
}
