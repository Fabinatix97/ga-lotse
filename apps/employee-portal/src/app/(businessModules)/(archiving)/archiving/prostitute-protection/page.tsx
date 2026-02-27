/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ArchivePage } from "@eshg/lib-employee-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import {
  procedureTypes,
  routes,
  useProstituteProtectionApiClients,
} from "@eshg/prostitute-protection";

import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function ProstituteProtectionArchivePage() {
  const { archivingApi } = useProstituteProtectionApiClients();
  return (
    <ArchivePage
      title={businessModuleNames[ApiBusinessModule.ProstituteProtection]}
      procedureDetailsRoute={(procedureId: string) =>
        routes.procedures.byId(procedureId).details
      }
      businessModule={ApiBusinessModule.ProstituteProtection}
      archivingApi={archivingApi}
      procedureTypes={procedureTypes}
    />
  );
}
