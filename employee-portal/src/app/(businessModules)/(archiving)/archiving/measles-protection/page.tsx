/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ArchivePage } from "@eshg/lib-employee-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { useArchivingApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { procedureTypes } from "@/lib/businessModules/measlesProtection/shared/constants";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function MeaslesProtectionArchivePage() {
  const archivingApi = useArchivingApi();

  return (
    <ArchivePage
      title={businessModuleNames[ApiBusinessModule.MeaslesProtection]}
      procedureDetailsRoute={(procedureId: string) =>
        routes.procedures.details(procedureId).index
      }
      businessModule={ApiBusinessModule.MeaslesProtection}
      archivingApi={archivingApi}
      procedureTypes={procedureTypes}
    />
  );
}
