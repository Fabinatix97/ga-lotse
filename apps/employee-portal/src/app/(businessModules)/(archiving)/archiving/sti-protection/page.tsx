/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ArchivePage } from "@eshg/lib-employee-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { useArchivingApi } from "@/lib/businessModules/stiProtection/api/clients";
import { procedureTypes } from "@/lib/businessModules/stiProtection/shared/constants";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function StiProtectionArchivePage() {
  const archivingApi = useArchivingApi();

  return (
    <ArchivePage
      title={businessModuleNames[ApiBusinessModule.StiProtection]}
      procedureDetailsRoute={(procedureId: string) =>
        routes.procedures.byId(procedureId).details
      }
      businessModule={ApiBusinessModule.StiProtection}
      archivingApi={archivingApi}
      procedureTypes={procedureTypes}
    />
  );
}
