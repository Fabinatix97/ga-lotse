/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/base-api";
import { InboxProceduresPage } from "@eshg/lib-employee-portal";

import { useInboxProcedureApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { procedureTypes } from "@/lib/businessModules/measlesProtection/shared/constants";

export default function MeaslesProtectionInboxProceduresPage() {
  const inboxProcedureApi = useInboxProcedureApi();

  return (
    <InboxProceduresPage
      inboxProcedureApi={inboxProcedureApi}
      businessModule={ApiBusinessModule.MeaslesProtection}
      procedureTypes={procedureTypes}
    />
  );
}
