/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  ApiDocumentDetails,
  ApiGetMarkdownInfoResponseCitizenAndEmployeeMarkdownInfo,
} from "@eshg/base-api";

import { configuratorApiQueryKey } from "@/lib/configurator/api/queries/apiQueryKey";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import {
  SupportedLanguage,
  mapToApiLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";

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
        citizen: supportedLanguages.reduce(
          (acc, lang) => {
            acc[lang] = mapToConfigFile(
              markdownInfo?.citizen?.localizations?.[mapToApiLanguage(lang)],
            );
            return acc;
          },
          {} as Record<SupportedLanguage, ConfigFile>,
        ),
        employee: supportedLanguages.reduce(
          (acc, lang) => {
            acc[lang] = mapToConfigFile(
              markdownInfo?.employee?.localizations?.[mapToApiLanguage(lang)],
            );
            return acc;
          },
          {} as Record<SupportedLanguage, ConfigFile>,
        ),
      };
    },
  });
  return result.data;
}

function mapToConfigFile(
  markdownInfo: ApiDocumentDetails | undefined,
): ConfigFile {
  if (!markdownInfo) {
    return null;
  }
  return {
    name: markdownInfo.fileName,
    size: markdownInfo.fileSizeBytes,
    type: "MD",
  };
}
