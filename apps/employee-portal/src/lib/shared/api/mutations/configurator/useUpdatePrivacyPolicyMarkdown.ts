/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isNullish } from "remeda";

import { DepartmentConfigurationApi } from "@eshg/base-api";
import { ApiLanguage } from "@eshg/lib-config-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { PrivacyPolicyMarkdownFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyPolicyMarkdown";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
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
    citizenDe: await buildFilePayload(params.citizenPortalPrivacyPolicyDe, () =>
      api.getCitizenMarkdownFile("PRIVACY", ApiLanguage.German),
    ),
    citizenEn: await buildOptionalFilePayload(
      params.citizenPortalPrivacyPolicyEn,
      () => api.getCitizenMarkdownFile("PRIVACY", ApiLanguage.English),
    ),
    employeeDe: await buildFilePayload(
      params.employeePortalPrivacyPolicyDe,
      () => api.getEmployeeMarkdownFile("PRIVACY", ApiLanguage.German),
    ),
    employeeEn: await buildOptionalFilePayload(
      params.employeePortalPrivacyPolicyEn,
      () => api.getEmployeeMarkdownFile("PRIVACY", ApiLanguage.English),
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
