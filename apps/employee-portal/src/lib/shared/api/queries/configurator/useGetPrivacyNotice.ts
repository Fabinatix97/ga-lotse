/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined, isNullish } from "remeda";

import { ApiGetPrivacyDocumentConfigResponse } from "@eshg/lib-config-api";

import { PrivacyNoticeFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyNotice";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useConfiguratorPrivacyDocumentApi } from "@/lib/shared/api/clients";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function useGetPrivacyNotice(module: ConfiguratorModuleName) {
  const { moduleApi, baseApi } = useConfiguratorPrivacyDocumentApi(module);

  const result = useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      module,
      moduleApi,
      "getPrivacyNoticeConfig",
    ]),
    queryFn: () => {
      if (module === "BASE") {
        return baseApi.getPrivacyNoticeConfig();
      }
      return moduleApi.getPrivacyNoticeConfig();
    },
    select: (data: ApiGetPrivacyDocumentConfigResponse) => {
      const { privacyDocument } = data;
      return {
        useNoticeOfHealthDepartment: isNullish(privacyDocument)
          ? "DEFAULT"
          : "CUSTOM",
        germanPrivacyNoticeDocument: isDefined(privacyDocument)
          ? {
              name: privacyDocument.de.fileName,
              type: "PDF",
              size: privacyDocument.de.fileSizeBytes,
            }
          : null,
        englishPrivacyNoticeDocument: isDefined(privacyDocument?.en)
          ? {
              name: privacyDocument.en.fileName,
              type: "PDF",
              size: privacyDocument.en.fileSizeBytes,
            }
          : null,
      } satisfies PrivacyNoticeFormModel;
    },
  });
  return result.data;
}
