/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { ApiLanguage } from "@eshg/base-api";
import { ApiGetInfectionBriefingConfigResponse } from "@eshg/infection-briefing-api";
import { CustomFileType } from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal";

import { InfectionBriefingFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/InfectionBriefing";
import { useConfiguratorInfectionBriefingApi } from "@/lib/shared/api/clients";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function useGetInfectionBriefingConfig() {
  const api = useConfiguratorInfectionBriefingApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey(["getConfig", api]),
    queryFn: () => api.getConfig(),
    select: (data: ApiGetInfectionBriefingConfigResponse) => {
      const { infectionBriefingConfig } = data;
      return {
        landingContentDe: isDefined(
          infectionBriefingConfig?.landingPageContent.de,
        )
          ? {
              name: infectionBriefingConfig.landingPageContent.de.fileName,
              type: CustomFileType.Md,
              size: infectionBriefingConfig.landingPageContent.de.fileSizeBytes,
            }
          : null,
        landingContentEn: isDefined(
          infectionBriefingConfig?.landingPageContent?.en,
        )
          ? {
              name: infectionBriefingConfig.landingPageContent.en.fileName,
              type: CustomFileType.Md,
              size: infectionBriefingConfig.landingPageContent.en.fileSizeBytes,
            }
          : null,
      } satisfies InfectionBriefingFormModel;
    },
  });
}

export function useDownloadInfectionBriefingLandingPage() {
  const api = useConfiguratorInfectionBriefingApi();
  return useFileDownload((lang: ApiLanguage) =>
    api.downloadLandingPageRaw({ lang }),
  );
}
