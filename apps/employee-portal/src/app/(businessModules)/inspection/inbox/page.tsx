/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/base-api";
import { InboxProceduresPage } from "@eshg/lib-employee-portal";

import { useInboxProcedureApi } from "@/lib/businessModules/inspection/api/clients";
import { useInspectionInboxProcedureCreateSidebar } from "@/lib/businessModules/inspection/components/inbox/InspectionInboxProcedureCreateSidebar";
import { procedureTypes } from "@/lib/businessModules/inspection/shared/constants";

export default function InspectionInboxProceduresPage() {
  const inboxProcedureApi = useInboxProcedureApi();
  const inspectionInboxProcedureCreateSidebar =
    useInspectionInboxProcedureCreateSidebar();

  return (
    <InboxProceduresPage
      inboxProcedureApi={inboxProcedureApi}
      businessModule={ApiBusinessModule.Inspection}
      procedureTypes={procedureTypes}
      onCreateProcedure={(inboxProcedureId) =>
        inspectionInboxProcedureCreateSidebar.open({ inboxProcedureId })
      }
    />
  );
}
