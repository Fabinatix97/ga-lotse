/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInformationStatementTemplateRequest,
  PutInformationStatementTemplateRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useInformationStatementTemplateApi } from "@/lib/businessModules/travelMedicine/api/clients";

export function useCreateInformationStatementTemplate() {
  const informationStatementTemplateApi = useInformationStatementTemplateApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiInformationStatementTemplateRequest) =>
      informationStatementTemplateApi.postInformationStatementTemplate(request),
    onSuccess: () => {
      snackbar.confirmation(
        "Die Aufklärungsbogenvorlage wurde erfolgreich angelegt.",
      );
    },
  });
}

export function useUpdateInformationStatementTemplate() {
  const informationStatementTemplateApi = useInformationStatementTemplateApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: PutInformationStatementTemplateRequest) =>
      informationStatementTemplateApi
        .putInformationStatementTemplateRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation(
        "Die Aufklärungsbogenvorlage wurde erfolgreich bearbeitet.",
      );
    },
  });
}

export function useDeleteInformationStatementTemplate() {
  const informationStatementTemplateApi = useInformationStatementTemplateApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (id: string) =>
      informationStatementTemplateApi.deleteInformationStatementTemplateById(
        id,
      ),
    onSuccess: () => {
      snackbar.confirmation(
        "Die Aufklärungsbogenvorlage wurde erfolgreich gelöscht.",
      );
    },
  });
}
