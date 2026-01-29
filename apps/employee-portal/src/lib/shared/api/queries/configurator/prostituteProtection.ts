/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { ApiLanguage } from "@eshg/base-api";
import { CustomFileType } from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal";
import { ApiGetProstituteProtectionConfigResponse } from "@eshg/prostitute-protection-api";

import { ProstituteProtectionFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/ProstituteProtection";
import { useConfiguratorProstituteProtectionApi } from "@/lib/shared/api/clients";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function useGetProstituteProtectionConfig() {
  const api = useConfiguratorProstituteProtectionApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey(["getConfig", api]),
    queryFn: () => api.getConfig(),
    select: (data: ApiGetProstituteProtectionConfigResponse) => {
      const { protectionConfig } = data;
      return {
        landingContentDe: isDefined(protectionConfig?.landingPageContent.de)
          ? {
              name: protectionConfig.landingPageContent.de.fileName,
              type: CustomFileType.Md,
              size: protectionConfig.landingPageContent.de.fileSizeBytes,
            }
          : null,
        landingContentEn: isDefined(protectionConfig?.landingPageContent?.en)
          ? {
              name: protectionConfig.landingPageContent.en.fileName,
              type: CustomFileType.Md,
              size: protectionConfig.landingPageContent.en.fileSizeBytes,
            }
          : null,
        onlinePortalBookingEnabled:
          protectionConfig?.onlinePortalBookingEnabled ?? false,
      } satisfies ProstituteProtectionFormModel;
    },
  });
}

export function useDownloadProstituteProtectionLandingPage() {
  const api = useConfiguratorProstituteProtectionApi();
  return useFileDownload((lang: ApiLanguage) =>
    api.downloadLandingPageRaw({ lang }),
  );
}
