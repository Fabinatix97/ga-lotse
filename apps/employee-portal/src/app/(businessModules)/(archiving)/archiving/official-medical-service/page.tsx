/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ArchivePage } from "@eshg/lib-employee-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { useArchivingApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { procedureTypes } from "@/lib/businessModules/officialMedicalService/shared/constants";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function OfficialMedicalServiceArchivePage() {
  const archivingApi = useArchivingApi();

  return (
    <ArchivePage
      title={businessModuleNames[ApiBusinessModule.OfficialMedicalService]}
      businessModule={ApiBusinessModule.OfficialMedicalService}
      procedureDetailsRoute={(procedureId) =>
        routes.procedures.byId(procedureId).details
      }
      archivingApi={archivingApi}
      procedureTypes={procedureTypes}
    />
  );
}
