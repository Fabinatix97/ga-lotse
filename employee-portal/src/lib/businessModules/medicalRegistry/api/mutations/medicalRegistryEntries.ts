/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CreateProcedureRequest } from "@eshg/employee-portal-api/medicalRegistry";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useMedicalRegistryApi } from "@/lib/businessModules/medicalRegistry/api/clients";

export function useCreateProcedure() {
  const medicalRegistryApi = useMedicalRegistryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: CreateProcedureRequest) =>
      medicalRegistryApi.createProcedureRaw(req).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Neuer Eintrag angelegt.");
    },
  });
}

export function useDeleteDraftProcedure() {
  const medicalRegistryApi = useMedicalRegistryApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    onSuccess: () => snackbar.confirmation("Der Entwurf wurde verworfen."),
    mutationFn: ({
      procedureId,
      version,
    }: {
      procedureId: string;
      version: number;
    }) =>
      medicalRegistryApi.deleteProcedureRaw({
        procedureId,
        apiDeleteProcedureRequest: { version },
      }),
  });
}
