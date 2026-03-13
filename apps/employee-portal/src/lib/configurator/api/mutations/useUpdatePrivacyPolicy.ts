/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BasePrivacyDocumentsApi } from "@eshg/base-api";
import { PrivacyDocumentApi } from "@eshg/lib-config-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { PrivacyPolicyFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyPolicy";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { SupportedLanguage, mapToApiLanguage } from "@/lib/i18n/language";
import { useConfiguratorPrivacyDocumentApi } from "@/lib/shared/api/clients";

import { buildMultiLanguagePayload } from "./buildFilePayload";

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
    return { files: [] };
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
    files: await buildMultiLanguagePayload(
      params.privacyPolicies,
      (lang: SupportedLanguage) =>
        api.downloadPrivacyPolicy(mapToApiLanguage(lang)),
      "pdf",
    ),
  };
}
