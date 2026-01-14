/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ArchiveAdminPage } from "@eshg/lib-employee-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import { useProstituteProtectionApiClients } from "@eshg/prostitute-protection";

import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function ProstituteProtectionArchiveAdminPage() {
  const { archivingApi } = useProstituteProtectionApiClients();

  return (
    <ArchiveAdminPage
      title={businessModuleNames[ApiBusinessModule.ProstituteProtection]}
      businessModule={ApiBusinessModule.ProstituteProtection}
      archivingApi={archivingApi}
    />
  );
}
