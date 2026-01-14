/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { BasePrivacyDocumentsApi } from "@eshg/base-api";
import { ApiLanguage, PrivacyDocumentApi } from "@eshg/lib-config-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { PrivacyPolicyFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyPolicy";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useConfiguratorPrivacyDocumentApi } from "@/lib/shared/api/clients";

import { buildFilePayload, buildOptionalFilePayload } from "./buildFilePayload";

export function useUpdatePrivacyPolicy(module: ConfiguratorModuleName) {
  const snackbar = useSnackbar();
  const { moduleApi, baseApi } = useConfiguratorPrivacyDocumentApi(module);

  const mutation = useHandledMutation({
    mutationFn: (params: PrivacyPolicyFormModel) => {
      if (module === "BASE") {
        return updatePrivacyPolicyBase(baseApi, params);
      }
      return updatePrivacyPolicy(moduleApi, params);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (model: PrivacyPolicyFormModel) => {
    return mutation.mutateAsync(model);
  };
}

async function updatePrivacyPolicy(
  api: PrivacyDocumentApi,
  params: PrivacyPolicyFormModel,
) {
  return api.updatePrivacyPolicyConfigRaw(await buildPayload(api, params));
}

async function buildPayload(
  api: PrivacyDocumentApi,
  params: PrivacyPolicyFormModel,
) {
  if (params.usePolicyOfHealthDepartment === "DEFAULT") {
    return {};
  }
  return await buildPayloadBase(api, params);
}

async function updatePrivacyPolicyBase(
  api: BasePrivacyDocumentsApi,
  params: PrivacyPolicyFormModel,
) {
  return api.updatePrivacyPolicyConfigRaw(await buildPayloadBase(api, params));
}

async function buildPayloadBase(
  api: BasePrivacyDocumentsApi | PrivacyDocumentApi,
  params: PrivacyPolicyFormModel,
) {
  return {
    de: await buildFilePayload(
      params.germanPrivacyPolicyDocument,
      () => api.downloadPrivacyPolicy(ApiLanguage.German),
      "document.pdf",
      "application/pdf",
    ),
    en: await buildOptionalFilePayload(
      params.englishPrivacyPolicyDocument,
      () => api.downloadPrivacyPolicy(ApiLanguage.English),
      "document.pdf",
      "application/pdf",
    ),
  };
}
