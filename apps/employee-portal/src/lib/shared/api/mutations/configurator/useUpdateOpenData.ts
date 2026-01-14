/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isNullish } from "remeda";

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { ApiLanguage, OpenDataConfigApi } from "@eshg/opendata-api";

import { OpenDataFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/OpenData";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { useOpenDataConfigApi } from "@/lib/shared/api/clients";

export function useUpdateOpenData() {
  const snackbar = useSnackbar();
  const openDataApi = useOpenDataConfigApi();

  const mutation = useHandledMutation({
    mutationFn: (params: OpenDataFormModel) => {
      return updateOpenData(openDataApi, params);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (model: OpenDataFormModel) => {
    return mutation.mutateAsync(model);
  };
}

async function updateOpenData(
  api: OpenDataConfigApi,
  params: OpenDataFormModel,
) {
  return api.updateOpenDataConfigRaw(await buildPayload(api, params));
}

async function buildPayload(api: OpenDataConfigApi, params: OpenDataFormModel) {
  return {
    termsOfUseDe: await buildFilePayload(params.openDataTermsOfUseDe, () =>
      api.downloadTermsOfUse(ApiLanguage.German),
    ),
    termsOfUseEn: await buildOptionalFilePayload(
      params.openDataTermsOfUseEn,
      () => api.downloadTermsOfUse(ApiLanguage.English),
    ),
    updateOpenDataConfigRequest: {
      author: params.openDataAuthor,
      fallbackLicenseUrl: params.openDataLicenceUrl,
    },
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
    ? new File([value], value.name, { type: "text/markdown" })
    : new File([await downloadFn()], "document.md", {
        type: "text/markdown",
      });
}
