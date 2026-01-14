/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateChildRequest,
  ApiImportStatistics,
  ImportXlsxRequest,
  UpdateFluoridationConsentInBulkRequest,
} from "@eshg/dental-api";
import { parseImportResult } from "@eshg/lib-employee-portal";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useDentalApi } from "../../../../contexts/dental";

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

export function useImportChildren() {
  const { childApi } = useDentalApi();
  return useHandledMutation({
    mutationFn: (request: ImportXlsxRequest) =>
      childApi
        .importXlsxRaw(request)
        .then(parseImportResult<ApiImportStatistics>),
  });
}

export function useUpdateFluoridationConsentInBulk() {
  const { childApi } = useDentalApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: UpdateFluoridationConsentInBulkRequest) =>
      childApi.updateFluoridationConsentInBulkRaw(request),
    onSuccess: () => {
      snackbar.confirmation(
        "Fluoridierungseinverständnis erfolgreich gespeichert.",
      );
    },
  });
}
