/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  ApiDocumentDetails,
  ApiGetOpenDataConfigResponse,
} from "@eshg/opendata-api";

import { OpenDataFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/OpenData";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import {
  SupportedLanguage,
  mapToApiLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";
import { useOpenDataConfigApi } from "@/lib/shared/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

export function useGetOpenDataConfig() {
  const openDataApi = useOpenDataConfigApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey(["getOpenDataConfig", openDataApi]),
    queryFn: () => openDataApi.getOpenDataConfig(),
    select: (data: ApiGetOpenDataConfigResponse) => ({
      values: {
        termsOfUse: supportedLanguages.reduce(
          (acc, lang) => {
            acc[lang] = mapToConfigFile(
              data.openDataConfig?.termsOfUse?.localizations?.[
                mapToApiLanguage(lang)
              ],
            );
            return acc;
          },
          {} as Record<SupportedLanguage, ConfigFile>,
        ),
        openDataLicenceUrl: data.openDataConfig?.licenseUrl ?? "",
        openDataAuthor: data.openDataConfig?.author ?? "",
      } satisfies OpenDataFormModel,
    }),
  });
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
