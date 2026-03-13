/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DepartmentConfigurationApi } from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { buildMultiLanguagePayload } from "@/lib/configurator/api/mutations/buildFilePayload";
import { PrivacyPolicyMarkdownFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyPolicyMarkdown";
import { SupportedLanguage, mapToApiLanguage } from "@/lib/i18n/language";
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";

export function useUpdatePrivacyPolicyMarkdown() {
  const snackbar = useSnackbar();
  const configApi = useDepartmentConfigurationApi();

  const mutation = useHandledMutation({
    mutationFn: (params: PrivacyPolicyMarkdownFormModel) => {
      return updatePrivacyPolicyMarkdown(configApi, params);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (model: PrivacyPolicyMarkdownFormModel) => {
    return mutation.mutateAsync(model);
  };
}

async function updatePrivacyPolicyMarkdown(
  api: DepartmentConfigurationApi,
  params: PrivacyPolicyMarkdownFormModel,
) {
  return api.updatePrivacyMarkdownRaw(await buildPayload(api, params));
}

async function buildPayload(
  api: DepartmentConfigurationApi,
  params: PrivacyPolicyMarkdownFormModel,
) {
  return {
    citizen: await buildMultiLanguagePayload(
      params.citizen,
      (lang: SupportedLanguage) =>
        api.getCitizenMarkdownFile("PRIVACY", mapToApiLanguage(lang)),
      "md",
    ),
    employee: await buildMultiLanguagePayload(
      params.employee,
      (lang: SupportedLanguage) =>
        api.getEmployeeMarkdownFile("PRIVACY", mapToApiLanguage(lang)),
      "md",
    ),
  };
}
