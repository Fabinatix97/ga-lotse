/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined, isNullish } from "remeda";

import { ApiGetPrivacyDocumentConfigResponse } from "@eshg/lib-config-api";

import { PrivacyPolicyFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyPolicy";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useConfiguratorPrivacyDocumentApi } from "@/lib/shared/api/clients";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function useGetPrivacyPolicy(module: ConfiguratorModuleName) {
  const { moduleApi, baseApi } = useConfiguratorPrivacyDocumentApi(module);

  const result = useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      module,
      moduleApi,
      "getPrivacyPolicyConfig",
    ]),
    queryFn: () => {
      if (module === "BASE") {
        return baseApi.getPrivacyPolicyConfig();
      }
      return moduleApi.getPrivacyPolicyConfig();
    },
    select: (data: ApiGetPrivacyDocumentConfigResponse) => {
      const { privacyDocument } = data;
      return {
        usePolicyOfHealthDepartment: isNullish(privacyDocument)
          ? "DEFAULT"
          : "CUSTOM",
        germanPrivacyPolicyDocument: isDefined(privacyDocument)
          ? {
              name: privacyDocument.de.fileName,
              type: "PDF",
              size: privacyDocument.de.fileSizeBytes,
            }
          : null,
        englishPrivacyPolicyDocument: isDefined(privacyDocument?.en)
          ? {
              name: privacyDocument.en.fileName,
              type: "PDF",
              size: privacyDocument.en.fileSizeBytes,
            }
          : null,
      } satisfies PrivacyPolicyFormModel;
    },
  });
  return result.data;
}
