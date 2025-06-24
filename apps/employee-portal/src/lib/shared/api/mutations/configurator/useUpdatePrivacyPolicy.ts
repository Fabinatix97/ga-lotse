/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isNullish } from "remeda";

import { BasePrivacyDocumentsApi } from "@eshg/base-api";
import { ApiLanguage, PrivacyDocumentApi } from "@eshg/lib-config-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { PrivacyPolicyFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyPolicy";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useConfiguratorPrivacyDocumentApi } from "@/lib/shared/api/clients";

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
    de: await buildFilePayload(params.germanPrivacyPolicyDocument, () =>
      api.downloadPrivacyPolicy(ApiLanguage.German),
    ),
    en: await buildOptionalFilePayload(
      params.englishPrivacyPolicyDocument,
      () => api.downloadPrivacyPolicy(ApiLanguage.English),
    ),
  };
}
async function buildOptionalFilePayload(
  value: ConfigFile,
  downloadFn: () => Promise<Blob>,
) {
  return isNullish(value)
    ? undefined
    : await buildFilePayload(value, downloadFn);
}

async function buildFilePayload(
  value: ConfigFile,
  downloadFn: () => Promise<Blob>,
) {
  return value instanceof File
    ? value
    : new File([await downloadFn()], "document.pdf", {
        type: "application/pdf",
      });
}
