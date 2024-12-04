/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";

import { useBulkUpdateProceduresArchivingRelevance } from "@/lib/businessModules/medicalRegistry/api/mutations/archiving";
import {
  useGetArchivableProcedures,
  useGetArchivingConfiguration,
} from "@/lib/businessModules/medicalRegistry/api/queries/archiving";
import { archivableProcedureTypes } from "@/lib/businessModules/medicalRegistry/shared/constants";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { ArchiveView } from "@/lib/shared/components/archiving/ArchiveView";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function ArchivePage() {
  return (
    <ArchiveView
      title={businessModuleNames[ApiBusinessModule.MedicalRegistry]}
      procedureDetailsRoute={(procedureId: string) =>
        routes.procedures.byId(procedureId).details
      }
      useGetArchivingConfiguration={useGetArchivingConfiguration}
      useGetArchivableProcedures={useGetArchivableProcedures}
      useBulkUpdateProceduresArchivingRelevance={
        useBulkUpdateProceduresArchivingRelevance
      }
      additionalFilters={{ procedureTypes: archivableProcedureTypes }}
    />
  );
}
