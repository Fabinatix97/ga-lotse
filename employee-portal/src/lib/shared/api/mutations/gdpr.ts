/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGdprProcedureType,
  GdprValidationTaskApiInterface,
} from "@eshg/employee-portal-api/businessProcedures";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

export function useAddDownloadPackage(
  taskApi: GdprValidationTaskApiInterface,
  type: ApiGdprProcedureType,
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
      taskApi.addDownloadPackage(gdprProcedureId, businessModuleProcedureId),
    onSuccess: () =>
      snackbar.confirmation(
        type === ApiGdprProcedureType.OfAccess
          ? "Die Dateneinsicht wurde freigegeben."
          : "Die Datenlöschung wurde freigegeben.",
      ),
  });
}
