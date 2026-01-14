/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ArchivePage } from "@eshg/lib-employee-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { useArchivingApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { procedureTypes } from "@/lib/businessModules/schoolEntry/shared/constants";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function SchoolEntryArchivePage() {
  const archivingApi = useArchivingApi();

  return (
    <ArchivePage
      title={businessModuleNames[ApiBusinessModule.SchoolEntry]}
      procedureDetailsRoute={(procedureId: string) =>
        routes.procedures.byId(procedureId).details
      }
      businessModule={ApiBusinessModule.SchoolEntry}
      archivingApi={archivingApi}
      procedureTypes={procedureTypes}
    />
  );
}
