/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPostEmployeeOmsProcedureRequest } from "@eshg/employee-portal-api/officialMedicalService";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useEmployeeOmsProcedureApi } from "@/lib/businessModules/officialMedicalService/api/clients";

export function usePostEmployeeProcedure() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: ApiPostEmployeeOmsProcedureRequest) =>
      employeeOmsProcedureApi.postEmployeeProcedure(request),
    onSuccess: () => {
      snackbar.confirmation("Der Vorgang wurde angelegt.");
    },
  });
}
