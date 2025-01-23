/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateChildRequest,
  UpdateChildRequest,
  UpdateExaminationRequest,
} from "@eshg/dental-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useQueryClient } from "@tanstack/react-query";

import { useChildApi } from "@/lib/businessModules/dental/api/clients";
import {
  getChildDetailsQuery,
  getExaminationQuery,
} from "@/lib/businessModules/dental/api/queries/childApi";

export function useCreateChild() {
  const childApi = useChildApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiCreateChildRequest) =>
      childApi.createChild(request),
    onSuccess: () => {
      snackbar.confirmation("Kind erfolgreich angelegt.");
    },
  });
}

export function useUpdateAnnualChild(childId: string) {
  const childApi = useChildApi();
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
  const childApi = useChildApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: () => childApi.closeSchoolYear(),
    onSuccess: () => {
      snackbar.confirmation("Das Schuljahr wurde erfolgreich abgeschlossen");
    },
  });
}

export function useUpdateExamination(examinationId: string) {
  const childApi = useChildApi();
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
