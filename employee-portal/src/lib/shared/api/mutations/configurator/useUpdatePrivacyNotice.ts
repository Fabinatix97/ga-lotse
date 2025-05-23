/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isNullish } from "remeda";

import { BasePrivacyDocumentsApi } from "@eshg/base-api";
import { ApiLanguage, PrivacyDocumentApi } from "@eshg/lib-config-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { PrivacyNoticeFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyNotice";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
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
    return {};
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
    de: await buildFilePayload(params.germanPrivacyNoticeDocument, () =>
      api.downloadPrivacyNotice(ApiLanguage.German),
    ),
    en: await buildOptionalFilePayload(
      params.englishPrivacyNoticeDocument,
      () => api.downloadPrivacyNotice(ApiLanguage.English),
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
