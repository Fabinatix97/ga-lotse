/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiAuditLogSource } from "@eshg/auditlog-api";
import { ApiBusinessModule } from "@eshg/base-api";

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
  [ApiAuditLogSource.MedsAbroad]:
    businessModuleNames[ApiBusinessModule.MedsAbroad],
  [ApiAuditLogSource.Opendata]: "Open Data",
  [ApiAuditLogSource.ProstituteProtection]:
    businessModuleNames[ApiBusinessModule.ProstituteProtection],
} satisfies Record<ApiAuditLogSource, string>;
