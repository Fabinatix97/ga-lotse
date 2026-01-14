/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { ApiGetAddressDirectoryConfigResponse } from "@eshg/base-api";
import { ApiDocumentDetails } from "@eshg/opendata-api";

import { AddressRegistryFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/AddressRegistry";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { useAddressRegistryConfigurationApi } from "@/lib/shared/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

export function useAddressRegistryConfig() {
  const addressRegistryApi = useAddressRegistryConfigurationApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      "getAddressRegistryConfig",
      addressRegistryApi,
    ]),
    queryFn: () => addressRegistryApi.getAddressRegistryConfig(),
    select: (data: ApiGetAddressDirectoryConfigResponse) =>
      ({
        streetDirectory: mapToConfigFile(data.streetDirectory),
        municipalityDirectory: mapToConfigFile(data.municipalityDirectory),
      }) satisfies AddressRegistryFormModel,
  });
}

function mapToConfigFile(csvInfo: ApiDocumentDetails | undefined): ConfigFile {
  if (!isDefined(csvInfo)) {
    return null;
  }
  return {
    name: csvInfo.fileName,
    size: csvInfo.fileSizeBytes,
    type: "CSV",
  };
}
