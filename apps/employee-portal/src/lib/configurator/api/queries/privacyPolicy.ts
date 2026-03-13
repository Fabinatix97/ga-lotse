/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { isNullish } from "remeda";

import { ApiGetPrivacyDocumentConfigResponse } from "@eshg/lib-config-api";

import { configuratorApiQueryKey } from "@/lib/configurator/api/queries/apiQueryKey";
import { PrivacyPolicyFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/PrivacyPolicy";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { mapToApiLanguage, supportedLanguages } from "@/lib/i18n/language";
import { useConfiguratorPrivacyDocumentApi } from "@/lib/shared/api/clients";

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
        privacyPolicies: supportedLanguages.reduce(
          (acc, lang) => {
            const doc =
              privacyDocument?.localizations?.[mapToApiLanguage(lang)];
            if (!doc) {
              acc[lang] = null;
              return acc;
            }

            acc[lang] = {
              name: doc.fileName,
              type: "PDF",
              size: doc.fileSizeBytes,
            };
            return acc;
          },
          {} as PrivacyPolicyFormModel["privacyPolicies"],
        ),
      } satisfies PrivacyPolicyFormModel;
    },
  });
  return result.data;
}
