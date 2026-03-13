/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DepartmentConfigurationApi } from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { buildMultiLanguagePayload } from "@/lib/configurator/api/mutations/buildFilePayload";
import { AccessibilityStatementFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/AccessibilityStatement";
import { SupportedLanguage, mapToApiLanguage } from "@/lib/i18n/language";
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";

export function useUpdateAccessibilityStatement() {
  const snackbar = useSnackbar();
  const configApi = useDepartmentConfigurationApi();

  const mutation = useHandledMutation({
    mutationFn: (params: AccessibilityStatementFormModel) => {
      return updateAccessibilityStatement(configApi, params);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (model: AccessibilityStatementFormModel) => {
    return mutation.mutateAsync(model);
  };
}

async function updateAccessibilityStatement(
  api: DepartmentConfigurationApi,
  params: AccessibilityStatementFormModel,
) {
  return api.updateAccessibilityMarkdownRaw(await buildPayload(api, params));
}

async function buildPayload(
  api: DepartmentConfigurationApi,
  params: AccessibilityStatementFormModel,
) {
  return {
    citizen: await buildMultiLanguagePayload(
      params.citizen,
      (lang: SupportedLanguage) =>
        api.getCitizenMarkdownFile("ACCESSIBILITY", mapToApiLanguage(lang)),
      "md",
    ),
    employee: await buildMultiLanguagePayload(
      params.employee,
      (lang: SupportedLanguage) =>
        api.getEmployeeMarkdownFile("ACCESSIBILITY", mapToApiLanguage(lang)),
      "md",
    ),
  };
}
