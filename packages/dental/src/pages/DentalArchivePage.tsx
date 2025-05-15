/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule, ApiProcedureType } from "@eshg/base-api";
import { ArchivePage } from "@eshg/lib-employee-portal";

import { routes } from "../config/routes";
import { useDentalApi } from "../contexts/dental";
import { DENTAL_MODULE_NAME } from "../translations/businessModule";

const PROCEDURE_TYPES = [ApiProcedureType.DentalChild];

function procedureDetailsRoute(procedureId: string): string {
  return routes.children.byId(procedureId).details;
}

export function DentalArchivePage() {
  const { archivingApi } = useDentalApi();

  return (
    <ArchivePage
      businessModule={ApiBusinessModule.Dental}
      title={DENTAL_MODULE_NAME}
      archivingApi={archivingApi}
      procedureTypes={PROCEDURE_TYPES}
      procedureDetailsRoute={procedureDetailsRoute}
    />
  );
}
