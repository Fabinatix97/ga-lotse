/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/base-api";
import { InboxProceduresPage } from "@eshg/lib-employee-portal";

import { useInboxProcedureApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { procedureTypes } from "@/lib/businessModules/schoolEntry/shared/constants";

export default function SchoolEntryInboxProceduresPage() {
  const inboxProcedureApi = useInboxProcedureApi();

  return (
    <InboxProceduresPage
      inboxProcedureApi={inboxProcedureApi}
      businessModule={ApiBusinessModule.SchoolEntry}
      procedureTypes={procedureTypes}
    />
  );
}
