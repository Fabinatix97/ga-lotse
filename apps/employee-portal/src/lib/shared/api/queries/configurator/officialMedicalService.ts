/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { ApiLanguage } from "@eshg/base-api";
import { useFileDownload } from "@eshg/lib-portal";
import { ApiGetOmsConfigResponse } from "@eshg/official-medical-service-api";

import { useConfiguratorOmsApi } from "@/lib/shared/api/clients";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function useGetOmsConfig() {
  const api = useConfiguratorOmsApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey(["getOmsConfig", api]),
    queryFn: () => api.getOmsConfig(),
    select: (data: ApiGetOmsConfigResponse) =>
      data._configuration ?? {
        concerns: undefined,
        landingPageContent: undefined,
        citizenPortalAnamnesisEnabled: "",
        keycloakUserCleanupJobOverdueDuration: "",
        medicalOpinionCutOffDateLeadTime: "",
      },
  });
}

export function useDownloadOmsConcerns() {
  const api = useConfiguratorOmsApi();
  return useFileDownload(() => api.downloadConcernsRaw());
}

export function useDownloadOmsLandingPage() {
  const api = useConfiguratorOmsApi();
  return useFileDownload((lang: ApiLanguage) =>
    api.downloadLandingPageRaw({ lang }),
  );
}
