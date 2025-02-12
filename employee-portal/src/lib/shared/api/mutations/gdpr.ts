/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { GdprValidationTaskApiInterface } from "@eshg/lib-procedures-api";

export function useAddDownloadPackage(taskApi: GdprValidationTaskApiInterface) {
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: ({
      gdprProcedureId,
      businessModuleProcedureId,
    }: {
      gdprProcedureId: string;
      businessModuleProcedureId: string;
    }) =>
      taskApi.addDownloadPackage(gdprProcedureId, businessModuleProcedureId),
    onSuccess: () =>
      snackbar.confirmation("Die Dateneinsicht wurde freigegeben."),
  });
}

export function useDeleteBusinessProcedure(
  taskApi: GdprValidationTaskApiInterface,
) {
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: ({
      gdprProcedureId,
      businessModuleProcedureId,
    }: {
      gdprProcedureId: string;
      businessModuleProcedureId: string;
    }) =>
      taskApi.deleteBusinessProcedure(
        gdprProcedureId,
        businessModuleProcedureId,
      ),
    onSuccess: () =>
      snackbar.confirmation("Die Datenlöschung wurde freigegeben."),
  });
}
