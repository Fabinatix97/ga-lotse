/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationOptions, useQueryClient } from "@tanstack/react-query";

import {
  ApiProphylaxisSessionDetails,
  ApiUpdateProphylaxisSessionExaminationsRequest,
  ApiUpdateProphylaxisSessionParticipantsRequest,
  ApiUpdateProphylaxisSessionRequest,
} from "@eshg/dental-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useDentalApi } from "../../../../contexts/dental";
import { ProphylaxisSessionExamination } from "../models/ProphylaxisSessionExamination";
import { getProphylaxisSessionQuery } from "../queries/details";

export function useUpdateProphylaxisSession(prophylaxisSessionId: string) {
  const { prophylaxisSessionApi } = useDentalApi();
  const queryClient = useQueryClient();
  const { queryKey } = getProphylaxisSessionQuery(prophylaxisSessionApi, {
    prophylaxisSessionId,
  });
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiUpdateProphylaxisSessionRequest) =>
      prophylaxisSessionApi.updateProphylaxisSession(
        prophylaxisSessionId,
        request,
      ),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Prophylaxe erfolgreich gespeichert.");
    },
  });
}

export function useDeleteProphylaxisSessionParticipantOptions(
  prophylaxisSessionId: string,
  prophylaxisSessionVersion: number,
  allParticipants: ProphylaxisSessionExamination[],
): MutationOptions<ApiProphylaxisSessionDetails, Error, string> {
  const { prophylaxisSessionApi } = useDentalApi();
  const queryClient = useQueryClient();
  const { queryKey } = getProphylaxisSessionQuery(prophylaxisSessionApi, {
    prophylaxisSessionId,
  });
  const snackbar = useSnackbar();
  return {
    meta: { updatesQuery: queryKey },
    mutationFn: (childExternalId: string) =>
      prophylaxisSessionApi.updateProphylaxisSessionParticipants(
        prophylaxisSessionId,
        {
          version: prophylaxisSessionVersion,
          participants: allParticipants
            .map((childExamination) => childExamination.id)
            .filter((id) => id !== childExternalId),
        },
      ),
    onSuccess: (response: ApiProphylaxisSessionDetails) => {
      snackbar.confirmation("Kind erfolgreich entfernt.");
      queryClient.setQueryData(queryKey, response);
    },
  };
}

export function useUpdateProphylaxisSessionParticipants(
  prophylaxisSessionId: string,
) {
  const { prophylaxisSessionApi } = useDentalApi();
  const queryClient = useQueryClient();
  const { queryKey } = getProphylaxisSessionQuery(prophylaxisSessionApi, {
    prophylaxisSessionId,
  });

  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (request: ApiUpdateProphylaxisSessionParticipantsRequest) =>
      prophylaxisSessionApi.updateProphylaxisSessionParticipants(
        prophylaxisSessionId,
        request,
      ),
    onSuccess: (response: ApiProphylaxisSessionDetails) => {
      queryClient.setQueryData(queryKey, response);
    },
  });
}

interface UseUpdateProphylaxisSessionExaminationsOptions {
  onSuccess: () => void;
}

export function useUpdateProphylaxisSessionExaminations(
  prophylaxisSessionId: string,
  options?: UseUpdateProphylaxisSessionExaminationsOptions,
) {
  const { prophylaxisSessionApi } = useDentalApi();
  const queryClient = useQueryClient();
  const { queryKey } = getProphylaxisSessionQuery(prophylaxisSessionApi, {
    prophylaxisSessionId,
  });
  const snackbar = useSnackbar();

  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (request: ApiUpdateProphylaxisSessionExaminationsRequest) =>
      prophylaxisSessionApi.updateProphylaxisSessionExaminations(
        prophylaxisSessionId,
        request,
      ),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Untersuchungen erfolgreich gespeichert.");
      options?.onSuccess?.();
    },
    alertOptions: {
      enableRetryAfterError: true,
      closeable: true,
    },
  });
}

export function useCloseProphylaxisSession(prophylaxisSessionId: string) {
  const { prophylaxisSessionApi } = useDentalApi();
  const queryClient = useQueryClient();
  const { queryKey } = getProphylaxisSessionQuery(prophylaxisSessionApi, {
    prophylaxisSessionId,
  });
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (prophylaxisSessionVersion: number) =>
      prophylaxisSessionApi.closeProphylaxisSession(prophylaxisSessionId, {
        version: prophylaxisSessionVersion,
      }),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Die Prophylaxe wurde erfolgreich abgeschlossen.");
    },
  });
}
