/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";

import { useBulkUpdateProceduresArchivingRelevance } from "@/lib/businessModules/measlesProtection/api/mutations/archiving";
import {
  useGetArchivableProcedures,
  useGetArchivingConfiguration,
} from "@/lib/businessModules/measlesProtection/api/queries/archiving";
import { procedureTypes } from "@/lib/businessModules/measlesProtection/shared/constants";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { ArchiveView } from "@/lib/shared/components/archiving/ArchiveView";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function ArchivePage() {
  return (
    <ArchiveView
      title={businessModuleNames[ApiBusinessModule.MeaslesProtection]}
      procedureDetailsRoute={(procedureId: string) =>
        routes.procedures.details(procedureId).index
      }
      useGetArchivingConfiguration={useGetArchivingConfiguration}
      useGetArchivableProcedures={useGetArchivableProcedures}
      useBulkUpdateProceduresArchivingRelevance={
        useBulkUpdateProceduresArchivingRelevance
      }
      additionalFilters={{ procedureTypes }}
    />
  );
}
