/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { CustomFileType } from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal";
import { ApiGetProstituteProtectionConfigResponse } from "@eshg/prostitute-protection-api";

import { configuratorApiQueryKey } from "@/lib/configurator/api/queries/apiQueryKey";
import { ProstituteProtectionFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/ProstituteProtection";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import {
  SupportedLanguage,
  mapToApiLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";
import { useConfiguratorProstituteProtectionApi } from "@/lib/shared/api/clients";

export function useGetProstituteProtectionConfig() {
  const api = useConfiguratorProstituteProtectionApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey(["getConfig", api]),
    queryFn: () => api.getConfig(),
    select: (data: ApiGetProstituteProtectionConfigResponse) => {
      return {
        landingContent: supportedLanguages.reduce(
          (acc, lang) => {
            if (
              !data.protectionConfig?.landingPageContent?.localizations?.[
                mapToApiLanguage(lang)
              ]
            ) {
              acc[lang] = null;
              return acc;
            }

            acc[lang] = {
              name: data.protectionConfig.landingPageContent.localizations[
                mapToApiLanguage(lang)
              ]!.fileName,
              type: CustomFileType.Md,
              size: data.protectionConfig.landingPageContent.localizations[
                mapToApiLanguage(lang)
              ]!.fileSizeBytes,
            };
            return acc;
          },
          {} as Record<SupportedLanguage, ConfigFile>,
        ),
        onlinePortalBookingEnabled:
          data.protectionConfig?.onlinePortalBookingEnabled ?? false,
      } satisfies ProstituteProtectionFormModel;
    },
  });
}

export function useDownloadProstituteProtectionLandingPage() {
  const api = useConfiguratorProstituteProtectionApi();
  return useFileDownload((lang: SupportedLanguage) =>
    api.downloadLandingPageRaw({ lang: mapToApiLanguage(lang) }),
  );
}
