/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import {
  ApiDocumentDetails,
  ApiGetOpenDataConfigResponse,
} from "@eshg/opendata-api";

import { OpenDataFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/OpenData";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { useOpenDataConfigApi } from "@/lib/shared/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

export function useGetOpenDataConfig() {
  const openDataApi = useOpenDataConfigApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey(["getOpenDataConfig", openDataApi]),
    queryFn: () => openDataApi.getOpenDataConfig(),
    select: (data: ApiGetOpenDataConfigResponse) => ({
      values: {
        openDataTermsOfUseDe: mapToConfigFile(
          data.openDataConfig?.termsOfUse.de,
        ),
        openDataTermsOfUseEn: mapToConfigFile(
          data.openDataConfig?.termsOfUse.en,
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
  if (!isDefined(markdownInfo)) {
    return null;
  }
  return {
    name: markdownInfo.fileName,
    size: markdownInfo.fileSizeBytes,
    type: "MD",
  };
}
