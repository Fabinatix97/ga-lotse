/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { ApiGetInfectionBriefingConfigResponse } from "@eshg/infection-briefing-api";
import { CustomFileType } from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal";

import { configuratorApiQueryKey } from "@/lib/configurator/api/queries/apiQueryKey";
import { InfectionBriefingFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/InfectionBriefing";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import {
  SupportedLanguage,
  mapToApiLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";
import { useConfiguratorInfectionBriefingApi } from "@/lib/shared/api/clients";

export function useGetInfectionBriefingConfig() {
  const api = useConfiguratorInfectionBriefingApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey(["getConfig", api]),
    queryFn: () => api.getConfig(),
    select: (data: ApiGetInfectionBriefingConfigResponse) => {
      return {
        landingContent: supportedLanguages.reduce(
          (acc, lang) => {
            if (
              !data.infectionBriefingConfig?.landingPageContent
                ?.localizations?.[mapToApiLanguage(lang)]
            ) {
              acc[lang] = null;
              return acc;
            }

            acc[lang] = {
              name: data.infectionBriefingConfig.landingPageContent
                .localizations[mapToApiLanguage(lang)]!.fileName,
              type: CustomFileType.Md,
              size: data.infectionBriefingConfig.landingPageContent
                .localizations[mapToApiLanguage(lang)]!.fileSizeBytes,
            };
            return acc;
          },
          {} as Record<SupportedLanguage, ConfigFile>,
        ),
      } satisfies InfectionBriefingFormModel;
    },
  });
}

export function useDownloadInfectionBriefingLandingPage() {
  const api = useConfiguratorInfectionBriefingApi();
  return useFileDownload((lang: SupportedLanguage) =>
    api.downloadLandingPageRaw({ lang: mapToApiLanguage(lang) }),
  );
}
