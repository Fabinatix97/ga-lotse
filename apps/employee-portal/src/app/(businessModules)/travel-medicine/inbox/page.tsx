/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/base-api";
import { InboxProceduresPage } from "@eshg/lib-employee-portal";

import { useInboxProcedureApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { procedureTypes } from "@/lib/businessModules/travelMedicine/shared/constants";

export default function TravelMedicineInboxProceduresPage() {
  const inboxProcedureApi = useInboxProcedureApi();

  return (
    <InboxProceduresPage
      inboxProcedureApi={inboxProcedureApi}
      businessModule={ApiBusinessModule.TravelMedicine}
      procedureTypes={procedureTypes}
    />
  );
}
