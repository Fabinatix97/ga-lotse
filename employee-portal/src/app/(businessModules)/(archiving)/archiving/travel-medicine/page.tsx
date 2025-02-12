/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { useBulkUpdateProceduresArchivingRelevance } from "@/lib/businessModules/travelMedicine/api/mutations/archiving";
import {
  useGetArchivableProcedures,
  useGetArchivingConfiguration,
} from "@/lib/businessModules/travelMedicine/api/queries/archiving";
import { procedureTypes } from "@/lib/businessModules/travelMedicine/shared/constants";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { ArchiveView } from "@/lib/shared/components/archiving/ArchiveView";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function ArchivePage() {
  return (
    <ArchiveView
      title={businessModuleNames[ApiBusinessModule.TravelMedicine]}
      procedureDetailsRoute={routes.procedures.baseData}
      useGetArchivingConfiguration={useGetArchivingConfiguration}
      useGetArchivableProcedures={useGetArchivableProcedures}
      useBulkUpdateProceduresArchivingRelevance={
        useBulkUpdateProceduresArchivingRelevance
      }
      additionalFilters={{ procedureTypes }}
    />
  );
}
