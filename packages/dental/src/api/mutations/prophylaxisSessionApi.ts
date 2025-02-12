/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateProphylaxisSessionRequest,
  ApiProphylaxisSessionDetails,
  ApiUpdateExaminationsInBulkRequest,
  ApiUpdateProphylaxisSessionParticipantsRequest,
  ApiUpdateProphylaxisSessionRequest,
} from "@eshg/dental-api";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { MutationOptions, useQueryClient } from "@tanstack/react-query";

import { ChildExamination } from "@/api/models/ChildExamination";
import { getProphylaxisSessionQuery } from "@/api/queries/prophylaxisSessionApi";
import { useDentalApi } from "@/shared/DentalProvider";

export function useCreateProphylaxisSession() {
  const { prophylaxisSessionApi } = useDentalApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiCreateProphylaxisSessionRequest) =>
      prophylaxisSessionApi.createProphylaxisSession(request),
    onSuccess: () => {
      snackbar.confirmation("Prophylaxe erfolgreich angelegt.");
    },
  });
}

export function useUpdateProphylaxisSession(prophylaxisSessionId: string) {
  const { prophylaxisSessionApi } = useDentalApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiUpdateProphylaxisSessionRequest) =>
      prophylaxisSessionApi.updateProphylaxisSession(
        prophylaxisSessionId,
        request,
      ),
    onSuccess: () => {
      snackbar.confirmation("Prophylaxe erfolgreich gespeichert.");
    },
  });
}

export function useDeleteProphylaxisSessionParticipantOptions(
  prophylaxisSessionId: string,
  prophylaxisSessionVersion: number,
  allParticipants: ChildExamination[],
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
            .map((childExamination) => childExamination.childId)
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
    mutationFn: (examinationUpdates: ApiUpdateExaminationsInBulkRequest[]) =>
      prophylaxisSessionApi.updateProphylaxisSessionExaminations(
        prophylaxisSessionId,
        { examinationUpdates },
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
