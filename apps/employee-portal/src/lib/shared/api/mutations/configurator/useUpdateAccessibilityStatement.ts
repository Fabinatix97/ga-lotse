/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isNullish } from "remeda";

import { DepartmentConfigurationApi } from "@eshg/base-api";
import { ApiLanguage } from "@eshg/lib-config-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { AccessibilityStatementFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/AccessibilityStatement";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
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
    citizenDe: await buildFilePayload(
      params.citizenPortalAccessibilityStatementDe,
      () => api.getCitizenMarkdownFile("ACCESSIBILITY", ApiLanguage.German),
    ),
    citizenEn: await buildOptionalFilePayload(
      params.citizenPortalAccessibilityStatementEn,
      () => api.getCitizenMarkdownFile("ACCESSIBILITY", ApiLanguage.English),
    ),
    employeeDe: await buildFilePayload(
      params.employeePortalAccessibilityStatementDe,
      () => api.getEmployeeMarkdownFile("ACCESSIBILITY", ApiLanguage.German),
    ),
    employeeEn: await buildOptionalFilePayload(
      params.employeePortalAccessibilityStatementEn,
      () => api.getEmployeeMarkdownFile("ACCESSIBILITY", ApiLanguage.English),
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
    ? new File([value], value.name, { type: "text/markdown" })
    : new File([await downloadFn()], "document.md", {
        type: "text/markdown",
      });
}
