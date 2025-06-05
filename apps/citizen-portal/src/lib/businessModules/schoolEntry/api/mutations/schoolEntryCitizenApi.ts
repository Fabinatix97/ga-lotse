/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import {
  ApiAddCitizenAnamnesisRequest,
  ApiUpdateCitizenAppointmentRequest,
} from "@eshg/school-entry-api";

import { useSchoolEntryCitizenApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { schoolEntryCitizenApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function useUpdateAppointmentAsCitizen() {
  const schoolEntryCitizenApi = useSchoolEntryCitizenApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiUpdateCitizenAppointmentRequest) =>
      schoolEntryCitizenApi.updateAppointmentAsCitizen(request),
    onSuccess: () => {
      snackbar.confirmation("Termin erfolgreich verschoben");
    },
  });
}

export function useAddCitizenAnamnesis() {
  const schoolEntryCitizenApi = useSchoolEntryCitizenApi();
  return useHandledMutation({
    mutationKey: schoolEntryCitizenApiQueryKey(["addSelfAnamnesis"]),
    mutationFn: (req: ApiAddCitizenAnamnesisRequest) =>
      schoolEntryCitizenApi.addAnamnesisAsCitizen(req),
  });
}
