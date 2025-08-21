/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InboxAwareBusinessModule } from "@/lib/baseModule/components/inboxProcedures/types";
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

  return (businessModule: InboxAwareBusinessModule) => {
    switch (businessModule) {
      case "SCHOOL_ENTRY":
        return schoolEntryInboxProcedureApi;
      case "INSPECTION":
        return inspectionInboxProcedureApi;
      case "TRAVEL_MEDICINE":
        return travelMedicineInboxProcedureApi;
      case "MEASLES_PROTECTION":
        return measlesProtectionInboxProcedureApi;
    }
  };
}
