/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ArchiveAdminPage } from "@eshg/lib-employee-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { useArchivingApi } from "@/lib/businessModules/inspection/api/clients";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function InspectionArchiveAdminPage() {
  const archivingApi = useArchivingApi();

  return (
    <ArchiveAdminPage
      title={businessModuleNames[ApiBusinessModule.Inspection]}
      businessModule={ApiBusinessModule.Inspection}
      archivingApi={archivingApi}
    />
  );
}
