/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateChildRequest,
  ApiSyncPersonRequest,
  UpdateChildPersonRequest,
  UpdateChildRequest,
  UpdateExaminationRequest,
} from "@eshg/dental-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useQueryClient } from "@tanstack/react-query";

import {
  getChildDetailsQuery,
  getExaminationQuery,
} from "@/api/queries/childApi";
import { useDentalApi } from "@/contexts/dental";

export function useCreateChild() {
  const { childApi } = useDentalApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiCreateChildRequest) =>
      childApi.createChild(request),
    onSuccess: () => {
      snackbar.confirmation("Kind erfolgreich angelegt.");
    },
  });
}

export function useUpdateAnnualChildPerson(childId: string) {
  const { childApi } = useDentalApi();
  const queryClient = useQueryClient();
  const { queryKey } = getChildDetailsQuery(childApi, childId);
  const snackbar = useSnackbar();

  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (request: UpdateChildPersonRequest) =>
      childApi.updateChildPersonRaw(request).then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation(
        "Die Änderungen zum Kind wurden erfolgreich gespeichert.",
      );
    },
  });
}

export function useSyncPerson(childId: string) {
  const { childApi } = useDentalApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiSyncPersonRequest) =>
      childApi.syncPersonData(childId, request),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden erfolgreich übernommen."),
  });
}

export function useUpdateAnnualChild(childId: string) {
  const { childApi } = useDentalApi();
  const queryClient = useQueryClient();
  const { queryKey } = getChildDetailsQuery(childApi, childId);
  const snackbar = useSnackbar();

  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (request: UpdateChildRequest) =>
      childApi.updateChildRaw(request).then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Die Zusatzinfos wurden erfolgreich geändert.");
    },
  });
}

export function useCloseSchoolYear() {
  const { childApi } = useDentalApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: () => childApi.closeSchoolYear(),
    onSuccess: () => {
      snackbar.confirmation("Das Schuljahr wurde erfolgreich abgeschlossen");
    },
  });
}

export function useUpdateExamination(examinationId: string) {
  const { childApi } = useDentalApi();
  const snackbar = useSnackbar();
  const { queryKey } = getExaminationQuery(childApi, examinationId);
  const queryClient = useQueryClient();

  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (request: UpdateExaminationRequest) =>
      childApi.updateExaminationRaw(request).then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Die Untersuchung wurde erfolgreich geändert.");
    },
  });
}
