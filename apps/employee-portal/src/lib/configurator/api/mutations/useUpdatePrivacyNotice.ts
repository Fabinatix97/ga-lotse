/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BasePrivacyDocumentsApi } from "@eshg/base-api";
import { PrivacyDocumentApi } from "@eshg/lib-config-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { buildMultiLanguagePayload } from "@/lib/configurator/api/mutations/buildFilePayload";
import { PrivacyNoticeFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyNotice";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { SupportedLanguage, mapToApiLanguage } from "@/lib/i18n/language";
import { useConfiguratorPrivacyDocumentApi } from "@/lib/shared/api/clients";

export function useUpdatePrivacyNotice(module: ConfiguratorModuleName) {
  const snackbar = useSnackbar();
  const { moduleApi, baseApi } = useConfiguratorPrivacyDocumentApi(module);

  const mutation = useHandledMutation({
    mutationFn: (params: PrivacyNoticeFormModel) => {
      if (module === "BASE") {
        return updatePrivacyNoticeBase(baseApi, params);
      }
      return updatePrivacyNotice(moduleApi, params);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (model: PrivacyNoticeFormModel) => {
    return mutation.mutateAsync(model);
  };
}

async function updatePrivacyNotice(
  api: PrivacyDocumentApi,
  params: PrivacyNoticeFormModel,
) {
  return api.updatePrivacyNoticeConfigRaw(await buildPayload(api, params));
}

async function buildPayload(
  api: PrivacyDocumentApi,
  params: PrivacyNoticeFormModel,
) {
  if (params.useNoticeOfHealthDepartment === "DEFAULT") {
    return { files: [] };
  }
  return await buildPayloadBase(api, params);
}

async function updatePrivacyNoticeBase(
  api: BasePrivacyDocumentsApi,
  params: PrivacyNoticeFormModel,
) {
  return api.updatePrivacyNoticeConfigRaw(await buildPayloadBase(api, params));
}

async function buildPayloadBase(
  api: BasePrivacyDocumentsApi | PrivacyDocumentApi,
  params: PrivacyNoticeFormModel,
) {
  return {
    files: await buildMultiLanguagePayload(
      params.files,
      (lang: SupportedLanguage) =>
        api.downloadPrivacyNotice(mapToApiLanguage(lang)),
      "pdf",
    ),
  };
}
