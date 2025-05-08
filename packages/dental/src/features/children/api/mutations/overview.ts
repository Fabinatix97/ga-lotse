/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateChildRequest,
  ApiImportStatistics,
  ImportXlsxRequest,
} from "@eshg/dental-api";
import { parseImportResult } from "@eshg/lib-employee-portal";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

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
