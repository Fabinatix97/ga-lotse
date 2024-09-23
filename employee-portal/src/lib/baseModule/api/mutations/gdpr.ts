/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddCentralFileIdToGdprProcedureRequest,
  ApiAddGdprProcedureRequest,
} from "@eshg/employee-portal-api/base";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useGdprProcedureApi } from "@/lib/baseModule/api/clients";

export function useAddGdprProcedure() {
  const gdprProcedureApi = useGdprProcedureApi();
  return useHandledMutation({
    mutationFn: async (request: ApiAddGdprProcedureRequest) => {
      return await gdprProcedureApi.addGdprProcedure(request);
    },
  });
}

export function useAddCentralFileIdToGdprProcedure(id: string) {
  const gdprProcedureApi = useGdprProcedureApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async (request: ApiAddCentralFileIdToGdprProcedureRequest) => {
      await gdprProcedureApi.addCentralFileIdToGdprProcedure(id, request);
    },
    onSuccess: () => {
      snackbar.confirmation("Stammdaten erfolgreich angeheftet");
    },
  });
}
