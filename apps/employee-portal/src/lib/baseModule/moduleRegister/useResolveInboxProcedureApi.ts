/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBusinessModule,
  InboxProcedureApiInterface,
} from "@eshg/lib-procedures-api";

import { useInboxProcedureApi as useInspectionInboxProcedureApi } from "@/lib/businessModules/inspection/api/clients";
import { useInboxProcedureApi as useMeaslesProtectionInboxProcedureApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { useInboxProcedureApi as useSchoolEntryInboxProcedureApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { useInboxProcedureApi as useTravelMedicineInboxProcedureApi } from "@/lib/businessModules/travelMedicine/api/clients";

export function useResolveInboxProcedureApi() {
  const schoolEntryInboxProcedureApi = useSchoolEntryInboxProcedureApi();
  const inspectionInboxProcedureApi = useInspectionInboxProcedureApi();
  const travelMedicineInboxProcedureApi = useTravelMedicineInboxProcedureApi();
  const measlesProtectionInboxProcedureApi =
    useMeaslesProtectionInboxProcedureApi();

  return (businessModule: ApiBusinessModule): InboxProcedureApiInterface => {
    switch (businessModule) {
      case "SCHOOL_ENTRY":
        return schoolEntryInboxProcedureApi;
      case "INSPECTION":
        return inspectionInboxProcedureApi;
      case "TRAVEL_MEDICINE":
        return travelMedicineInboxProcedureApi;
      case "MEASLES_PROTECTION":
        return measlesProtectionInboxProcedureApi;
      default:
        throw new Error("Business module does not support inbox procedures");
    }
  };
}
