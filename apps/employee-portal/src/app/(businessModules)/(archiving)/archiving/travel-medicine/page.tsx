/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ArchivePage } from "@eshg/lib-employee-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { useArchivingApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { procedureTypes } from "@/lib/businessModules/travelMedicine/shared/constants";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function TravelMedicineArchivePage() {
  const archivingApi = useArchivingApi();

  return (
    <ArchivePage
      title={businessModuleNames[ApiBusinessModule.TravelMedicine]}
      procedureDetailsRoute={routes.procedures.baseData}
      businessModule={ApiBusinessModule.TravelMedicine}
      archivingApi={archivingApi}
      procedureTypes={procedureTypes}
    />
  );
}
