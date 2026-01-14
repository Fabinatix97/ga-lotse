/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import {
  ApiDocumentDetails,
  ApiGetMarkdownInfoResponseCitizenAndEmployeeMarkdownInfo,
} from "@eshg/base-api";

import { PrivacyPolicyMarkdownFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyPolicyMarkdown";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function useGetPrivacyPolicyMarkdownConfig() {
  const configApi = useDepartmentConfigurationApi();

  const result = useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      "BASE",
      configApi,
      "getPrivacyPolicyMarkdownConfig",
    ]),
    queryFn: () => {
      return configApi.getPrivacyInfo();
    },
    select: (
      data: ApiGetMarkdownInfoResponseCitizenAndEmployeeMarkdownInfo,
    ) => {
      const { markdownInfo } = data;
      return {
        citizenPortalPrivacyPolicyDe: mapToConfigFile(markdownInfo?.citizen.de),
        citizenPortalPrivacyPolicyEn: mapToConfigFile(markdownInfo?.citizen.en),
        employeePortalPrivacyPolicyDe: mapToConfigFile(
          data.markdownInfo?.employee.de,
        ),
        employeePortalPrivacyPolicyEn: mapToConfigFile(
          data.markdownInfo?.employee.en,
        ),
      } satisfies PrivacyPolicyMarkdownFormModel;
    },
  });
  return result.data;
}

function mapToConfigFile(
  markdownInfo: ApiDocumentDetails | undefined,
): ConfigFile {
  if (!isDefined(markdownInfo)) {
    return null;
  }
  return {
    name: markdownInfo.fileName,
    size: markdownInfo?.fileSizeBytes,
    type: "MD",
  };
}
