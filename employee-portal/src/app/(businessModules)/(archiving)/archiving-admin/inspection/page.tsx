/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";

import {
  useBulkUpdateProceduresArchivingRelevance,
  useExportRelevantProcedures,
} from "@/lib/businessModules/inspection/api/mutations/archiving";
import { useGetRelevantArchivableProcedures } from "@/lib/businessModules/inspection/api/queries/archiving";
import { ArchiveAdminView } from "@/lib/shared/components/archiving/ArchiveAdminView";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function ArchiveAdminPage() {
  return (
    <ArchiveAdminView
      title={businessModuleNames[ApiBusinessModule.Inspection]}
      useGetRelevantArchivableProcedures={useGetRelevantArchivableProcedures}
      useExportRelevantProcedures={useExportRelevantProcedures}
      useBulkUpdateProceduresArchivingRelevance={
        useBulkUpdateProceduresArchivingRelevance
      }
    />
  );
}
