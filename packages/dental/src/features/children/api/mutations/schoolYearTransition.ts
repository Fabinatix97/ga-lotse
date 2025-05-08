/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCloseChildrenBulkRequest,
  ApiCloseGroupsBulkRequest,
  ApiPromoteChildrenBulkRequest,
  ApiPromoteGroupsBulkRequest,
} from "@eshg/dental-api";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useDentalApi } from "../../../../contexts/dental";

export function useCloseGroupsInBulk() {
  const { childApi } = useDentalApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: ApiCloseGroupsBulkRequest) =>
      childApi.closeGroupsInBulk(request),
    onSuccess: () => {
      snackbar.confirmation("Schulabgang erfolgreich durchgeführt.");
    },
  });
}

export function useCloseChildrenInBulk() {
  const { childApi } = useDentalApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: ApiCloseChildrenBulkRequest) =>
      childApi.closeChildrenInBulk(request),
    onSuccess: () => {
      snackbar.confirmation("Kita-Zeit erfolgreich beendet.");
    },
  });
}

export function usePromoteGroupsInBulk() {
  const { childApi } = useDentalApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: ApiPromoteGroupsBulkRequest) => {
      return childApi.promoteGroupsInBulk(request);
    },
    onSuccess: () => {
      snackbar.confirmation("Hochstufen erfolgreich durchgeführt.");
    },
  });
}

export function usePromoteChildrenInBulk() {
  const { childApi } = useDentalApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: ApiPromoteChildrenBulkRequest) =>
      childApi.promoteChildrenInBulk(request),
    onSuccess: () => {
      snackbar.confirmation("Kita-Zeit erfolgreich fortgeführt.");
    },
  });
}
