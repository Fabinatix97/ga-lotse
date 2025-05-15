/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ArchivePage } from "@eshg/lib-employee-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

import { useArchivingApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import { archivableProcedureTypes } from "@/lib/businessModules/medicalRegistry/shared/constants";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export default function MedicalRegistryArchivePage() {
  const archivingApi = useArchivingApi();

  return (
    <ArchivePage
      title={businessModuleNames[ApiBusinessModule.MedicalRegistry]}
      procedureDetailsRoute={(procedureId: string) =>
        routes.procedures.byId(procedureId).details
      }
      archivingApi={archivingApi}
      businessModule={ApiBusinessModule.MedicalRegistry}
      procedureTypes={archivableProcedureTypes}
    />
  );
}
