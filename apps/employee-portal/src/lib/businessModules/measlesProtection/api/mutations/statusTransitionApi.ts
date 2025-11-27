/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MutationPassThrough,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";

import { useStatusTransitionApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";
import { CLOSE_PROCEDURE_SUCCESS_MESSAGE } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";

interface UseCloseProcedureRequest {
  procedureId: string;
}

interface UseReopenProcedureRequest {
  procedureId: string;
}

export function useCloseProcedure({
  onSuccess,
  onError,
}: MutationPassThrough<UseCloseProcedureRequest, void> = {}) {
  const statusTransitionApi = useStatusTransitionApi();

  return useHandledMutation({
    mutationFn: (request: UseCloseProcedureRequest) =>
      statusTransitionApi.close(request.procedureId),
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}

export function useReopenProcedure({
  onSuccess,
  onError,
}: MutationPassThrough<UseReopenProcedureRequest, void> = {}) {
  const statusTransitionApi = useStatusTransitionApi();

  return useHandledMutation({
    mutationFn: (request: UseReopenProcedureRequest) =>
      statusTransitionApi.reopen(request.procedureId),
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}

export function useCloseVaccinated() {
  const api = useStatusTransitionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (procedureId: string) => api.closeVaccinated(procedureId),
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess: () => snackbar.confirmation(CLOSE_PROCEDURE_SUCCESS_MESSAGE),
  });
}
