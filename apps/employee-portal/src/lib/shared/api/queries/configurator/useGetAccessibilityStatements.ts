/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import {
  ApiDocumentDetails,
  ApiGetMarkdownInfoResponseCitizenAndEmployeeMarkdownInfo,
} from "@eshg/base-api";

import { AccessibilityStatementFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/AccessibilityStatement";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function useGetAccessibilityStatements() {
  const configApi = useDepartmentConfigurationApi();

  const result = useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      "BASE",
      configApi,
      "getAccessibilityInfo",
    ]),
    queryFn: () => {
      return configApi.getAccessibilityInfo();
    },
    select: (
      data: ApiGetMarkdownInfoResponseCitizenAndEmployeeMarkdownInfo,
    ) => {
      const { markdownInfo } = data;
      return {
        citizenPortalAccessibilityStatementDe: mapToConfigFile(
          markdownInfo?.citizen.de,
        ),
        citizenPortalAccessibilityStatementEn: mapToConfigFile(
          markdownInfo?.citizen.en,
        ),
        employeePortalAccessibilityStatementDe: mapToConfigFile(
          data.markdownInfo?.employee.de,
        ),
        employeePortalAccessibilityStatementEn: mapToConfigFile(
          data.markdownInfo?.employee.en,
        ),
      } satisfies AccessibilityStatementFormModel;
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
    size: markdownInfo.fileSizeBytes,
    type: "MD",
  };
}
