/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useFetchInboxProcedures } from "@/lib/businessModules/inspection/api/queries/inboxProcedures";
import { useInspectionInboxProcedureCreateSidebar } from "@/lib/businessModules/inspection/components/inbox/InspectionInboxProcedureCreateSidebar";
import { procedureTypes } from "@/lib/businessModules/inspection/shared/constants";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { InboxProceduresTablePage } from "@/lib/shared/components/procedures/inbox/InboxProceduresPage";

export function InspectionInboxProcedureCreatePage() {
  useInspectionInboxProcedureCreateSidebar();
  return (
    <InboxProceduresTablePage
      procedureTypes={procedureTypes}
      useFetchInboxProcedures={useFetchInboxProcedures}
      routes={routes.inbox}
      sidebar={false}
    />
  );
}
