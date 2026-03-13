/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isNullish } from "remeda";

import { ApiGetPrivacyDocumentConfigResponse } from "@eshg/lib-config-api";

import { configuratorApiQueryKey } from "@/lib/configurator/api/queries/apiQueryKey";
import { PrivacyNoticeFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyNotice";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import {
  SupportedLanguage,
  mapToApiLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";
import { useConfiguratorPrivacyDocumentApi } from "@/lib/shared/api/clients";

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
        files: supportedLanguages.reduce(
          (acc, lang) => {
            if (!privacyDocument?.localizations?.[mapToApiLanguage(lang)]) {
              acc[lang] = null;
              return acc;
            }

            acc[lang] = {
              name: privacyDocument.localizations[mapToApiLanguage(lang)]!
                .fileName,
              type: "PDF",
              size: privacyDocument.localizations[mapToApiLanguage(lang)]!
                .fileSizeBytes,
            };
            return acc;
          },
          {} as Record<SupportedLanguage, ConfigFile>,
        ),
      } satisfies PrivacyNoticeFormModel;
    },
  });
  return result.data;
}
