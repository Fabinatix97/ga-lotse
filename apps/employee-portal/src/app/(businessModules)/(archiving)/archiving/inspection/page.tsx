/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ArchivePage } from "@eshg/lib-employee-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { useArchivingApi } from "@/lib/businessModules/inspection/api/clients";
import { procedureTypes } from "@/lib/businessModules/inspection/shared/constants";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function InspectionArchivePage() {
  const archivingApi = useArchivingApi();

  return (
    <ArchivePage
      title={businessModuleNames[ApiBusinessModule.Inspection]}
      procedureDetailsRoute={routes.procedures.details}
      businessModule={ApiBusinessModule.Inspection}
      archivingApi={archivingApi}
      procedureTypes={procedureTypes}
    />
  );
}
