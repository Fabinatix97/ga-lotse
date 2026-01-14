/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQueryClient } from "@tanstack/react-query";

import {
  unwrapRawResponse,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  AbortProcedureRequest,
  ApiAbortProcedureRequest,
  ApiCloseProcedureRequest,
  ApiCreateProstituteProtectionProcedureRequest,
  ApiUpdateEncryptedPersonalDataRequest,
  ApiUpdateProstituteProtectionProcedureRequest,
  ApiWaitingRoom,
} from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";
import { useGetProcedureOptions } from "../queries/procedures";

export function useCreateProcedureMutation() {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (req: ApiCreateProstituteProtectionProcedureRequest) =>
      prostituteProtectionApi.createProcedure(req),
    onSuccess: () => snackbar.confirmation("Vorgang erfolgreich erstellt"),
  });
}

export function useUpdateProcedurePersonalDataMutation(procedureId: string) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const snackbar = useSnackbar();
  const { queryKey } = useGetProcedureOptions(procedureId);
  const queryClient = useQueryClient();

  return useHandledMutation({
    mutationFn: (
      apiUpdateEncryptedPersonalDataRequest: ApiUpdateEncryptedPersonalDataRequest,
    ) =>
      prostituteProtectionApi
        .updateProcedurePersonalDataRaw({
          procedureId,
          apiUpdateEncryptedPersonalDataRequest,
        })
        .then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Persönliche Daten erfolgreich aktualisiert");
    },
  });
}

export function useUpdateProcedureMutation(procedureId: string) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const snackbar = useSnackbar();
  const { queryKey } = useGetProcedureOptions(procedureId);
  const queryClient = useQueryClient();

  return useHandledMutation({
    mutationFn: (
      apiUpdateProstituteProtectionProcedureRequest: ApiUpdateProstituteProtectionProcedureRequest,
    ) =>
      prostituteProtectionApi
        .updateProcedureRaw({
          procedureId,
          apiUpdateProstituteProtectionProcedureRequest,
        })
        .then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Zusätzliche Angaben erfolgreich aktualisiert");
    },
  });
}

export function useSimpleAbortProcedureMutation() {
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

export function useAbortProcedureMutation(procedureId: string) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const snackbar = useSnackbar();
  const { queryKey } = useGetProcedureOptions(procedureId);
  const queryClient = useQueryClient();

  return useHandledMutation({
    mutationFn: (apiAbortProcedureRequest: ApiAbortProcedureRequest) =>
      prostituteProtectionApi
        .abortProcedureRaw({ procedureId, apiAbortProcedureRequest })
        .then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Der Vorgang wurde erfolgreich verworfen.");
    },
  });
}

export function useCloseProcedureMutation(procedureId: string) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const snackbar = useSnackbar();
  const { queryKey } = useGetProcedureOptions(procedureId);
  const queryClient = useQueryClient();

  return useHandledMutation({
    mutationFn: (apiCloseProcedureRequest: ApiCloseProcedureRequest) =>
      prostituteProtectionApi
        .closeProcedureRaw({ procedureId, apiCloseProcedureRequest })
        .then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Der Vorgang wurde erfolgreich abgeschlossen.");
    },
  });
}

export function useUpdateWaitingRoom(procedureId: string) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const snackbar = useSnackbar();
  const { queryKey } = useGetProcedureOptions(procedureId);
  const queryClient = useQueryClient();

  return useHandledMutation({
    mutationFn: (request: ApiWaitingRoom) =>
      prostituteProtectionApi
        .updateWaitingRoomRaw({ procedureId, apiWaitingRoom: request })
        .then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, (procedureResponse) => {
        if (procedureResponse === undefined) {
          return undefined;
        }

        return { ...procedureResponse, waitingRoom: response };
      });
      snackbar.confirmation(
        "Die Wartezimmer Informationen wurden erfolgreich geändert.",
      );
    },
  });
}
