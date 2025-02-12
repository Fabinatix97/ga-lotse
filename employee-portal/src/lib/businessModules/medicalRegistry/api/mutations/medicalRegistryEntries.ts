/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ConfirmProcedureRequest,
  CreateProcedureRequest,
} from "@eshg/medical-registry-api";
import { useRouter } from "next/navigation";

import { useMedicalRegistryApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";

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

export function useConfirmDraft() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const medicalRegistryApi = useMedicalRegistryApi();

  return useHandledMutation({
    mutationFn: (request: ConfirmProcedureRequest) =>
      medicalRegistryApi.confirmProcedureRaw(request).then(unwrapRawResponse),
    onSuccess: (newProcedureId: string) => {
      snackbar.confirmation("Der Eintrag wurde angelegt.");
      router.push(routes.procedures.byId(newProcedureId).details);
    },
    onError: () =>
      snackbar.error("Der Entwurf konnte nicht übernommen werden."),
  });
}
