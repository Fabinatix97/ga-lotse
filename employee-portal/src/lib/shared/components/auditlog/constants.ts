/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiAuditLogSource } from "@eshg/employee-portal-api/auditlog/models";
import { ApiBusinessModule } from "@eshg/employee-portal-api/base";

import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export const auditLogSourceNames = {
  [ApiAuditLogSource.Auditlog]: "Auditlog",
  [ApiAuditLogSource.Base]: "Grundmodul",
  [ApiAuditLogSource.Inspection]:
    businessModuleNames[ApiBusinessModule.Inspection],
  [ApiAuditLogSource.SchoolEntry]:
    businessModuleNames[ApiBusinessModule.SchoolEntry],
  [ApiAuditLogSource.Statistics]: "Statistik",
  [ApiAuditLogSource.TravelMedicine]:
    businessModuleNames[ApiBusinessModule.TravelMedicine],
  [ApiAuditLogSource.MeaslesProtection]:
    businessModuleNames[ApiBusinessModule.MeaslesProtection],
  [ApiAuditLogSource.StiProtection]:
    businessModuleNames[ApiBusinessModule.StiProtection],
  [ApiAuditLogSource.MedicalRegistry]:
    businessModuleNames[ApiBusinessModule.MedicalRegistry],
  [ApiAuditLogSource.Dental]: businessModuleNames[ApiBusinessModule.Dental],
  [ApiAuditLogSource.OfficialMedicalService]:
    businessModuleNames[ApiBusinessModule.OfficialMedicalService],
} satisfies Record<ApiAuditLogSource, string>;
