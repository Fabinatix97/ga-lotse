/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  unwrapRawResponse,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  ApiInformationStatementTemplateRequest,
  PutInformationStatementTemplateRequest,
} from "@eshg/travel-medicine-api";

import { useInformationStatementTemplateApi } from "@/lib/businessModules/travelMedicine/api/clients";

export function useCreateInformationStatementTemplate() {
  const informationStatementTemplateApi = useInformationStatementTemplateApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiInformationStatementTemplateRequest) =>
      informationStatementTemplateApi.postInformationStatementTemplate(request),
    onSuccess: () => {
      snackbar.confirmation("Die Aufklärungsbogenvorlage wurde angelegt.");
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
      snackbar.confirmation("Die Aufklärungsbogenvorlage wurde gespeichert.");
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
      snackbar.confirmation("Die Aufklärungsbogenvorlage wurde gelöscht.");
    },
  });
}
