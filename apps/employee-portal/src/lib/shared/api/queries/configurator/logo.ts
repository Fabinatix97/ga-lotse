/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import {
  ApiDocumentDetails,
  ApiGetLogoSvgFileInfoResponse,
} from "@eshg/base-api";

import { LogoFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/Logo";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function useGetLogoInfo() {
  const configApi = useDepartmentConfigurationApi();

  const result = useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      "BASE",
      configApi,
      "getLogoSvgFileInfo",
    ]),
    queryFn: () => {
      return configApi.getLogoSvgFileInfo();
    },
    select: (data: ApiGetLogoSvgFileInfoResponse) => {
      const { logoSvgInfo } = data;
      return {
        logo: mapToConfigFile(logoSvgInfo),
      } satisfies LogoFormModel;
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
    type: "SVG",
  };
}
