/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { OpenDataConfigApi } from "@eshg/opendata-api";

import { buildMultiLanguagePayload } from "@/lib/configurator/api/mutations/buildFilePayload";
import { OpenDataFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/OpenData";
import { SupportedLanguage, mapToApiLanguage } from "@/lib/i18n/language";
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
    files: await buildMultiLanguagePayload(
      params.termsOfUse,
      (lang: SupportedLanguage) =>
        api.downloadTermsOfUse(mapToApiLanguage(lang)),
      "md",
    ),
    updateOpenDataConfigRequest: {
      author: params.openDataAuthor,
      fallbackLicenseUrl: params.openDataLicenceUrl,
    },
  };
}
