/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import {
  CreateProcedureLabelRequest,
  ProcedureLabelClient,
  UpdateProcedureLabelRequest,
} from "@/features/procedureLabels/types/procedureLabelClient";

export function useCreateProcedureLabel(
  procedureLabelApi: ProcedureLabelClient,
) {
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: CreateProcedureLabelRequest) =>
      procedureLabelApi.createLabel(request),
    onSuccess: () => {
      snackbar.confirmation("Kennung erfolgreich angelegt.");
    },
  });
}

export function useUpdateProcedureLabel(
  procedureLabelApi: ProcedureLabelClient,
) {
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UpdateProcedureLabelRequest) =>
      procedureLabelApi.updateLabelRaw(request).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Kennung erfolgreich geändert.");
    },
  });
}
