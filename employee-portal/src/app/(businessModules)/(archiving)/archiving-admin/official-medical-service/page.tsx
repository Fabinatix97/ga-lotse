/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import {
  useBulkUpdateProceduresArchivingRelevance,
  useExportRelevantProcedures,
} from "@/lib/businessModules/officialMedicalService/api/mutations/archiving";
import { useGetRelevantArchivableProcedures } from "@/lib/businessModules/officialMedicalService/api/queries/archiving";
import { ArchiveAdminView } from "@/lib/shared/components/archiving/ArchiveAdminView";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function ArchiveAdminPage() {
  return (
    <ArchiveAdminView
      title={businessModuleNames[ApiBusinessModule.OfficialMedicalService]}
      useGetRelevantArchivableProcedures={useGetRelevantArchivableProcedures}
      useExportRelevantProcedures={useExportRelevantProcedures}
      useBulkUpdateProceduresArchivingRelevance={
        useBulkUpdateProceduresArchivingRelevance
      }
    />
  );
}
