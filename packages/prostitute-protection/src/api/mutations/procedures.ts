/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  unwrapRawResponse,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  AbortProcedureRequest,
  ApiCreateProstituteProtectionProcedureRequest,
  CloseProcedureRequest,
  UpdateProcedurePersonalDataRequest,
  UpdateProcedureRequest,
} from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

export function useCreateProcedureMutation() {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (req: ApiCreateProstituteProtectionProcedureRequest) =>
      prostituteProtectionApi.createProcedure(req),
    onSuccess: () => snackbar.confirmation("Vorgang erfolgreich erstellt"),
  });
}

export function useUpdateProcedurePersonalDataMutation() {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: UpdateProcedurePersonalDataRequest) =>
      prostituteProtectionApi
        .updateProcedurePersonalDataRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () =>
      snackbar.confirmation("Persönliche Daten erfolgreich aktualisiert"),
  });
}

export function useUpdateProcedureMutation() {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: UpdateProcedureRequest) =>
      prostituteProtectionApi
        .updateProcedureRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Zusätzliche Angaben erfolgreich aktualisiert");
    },
  });
}

export function useAbortProcedureMutation() {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: AbortProcedureRequest) =>
      prostituteProtectionApi
        .abortProcedureRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () =>
      snackbar.confirmation("Der Vorgang wurde erfolgreich verworfen."),
  });
}

export function useCloseProcedureMutation() {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: CloseProcedureRequest) =>
      prostituteProtectionApi
        .closeProcedureRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Der Vorgang wurde erfolgreich abgeschlossen.");
    },
  });
}
