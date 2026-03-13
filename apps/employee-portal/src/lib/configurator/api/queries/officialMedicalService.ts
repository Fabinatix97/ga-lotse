/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { ApiLanguage } from "@eshg/base-api";
import { CustomFileType } from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal";
import {
  ApiDocumentDetails,
  ApiFileType,
  ApiGetOmsConfigResponse,
} from "@eshg/official-medical-service-api";

import { configuratorApiQueryKey } from "@/lib/configurator/api/queries/apiQueryKey";
import { OfficialMedicalServiceFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/OfficialMedicalService";
import {
  ConfigFile,
  FileUploadValue,
} from "@/lib/configurator/components/shared/RenderField";
import {
  SupportedLanguage,
  mapToApiLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";
import { useConfiguratorOmsApi } from "@/lib/shared/api/clients";

export function useGetOmsConfig() {
  const api = useConfiguratorOmsApi();
  const result = useSuspenseQuery({
    queryKey: configuratorApiQueryKey(["getOmsConfig", api]),
    queryFn: () => api.getOmsConfig(),
    select: (dataApi: ApiGetOmsConfigResponse) => {
      const data = dataApi._configuration ?? {
        concerns: undefined,
        landingPageContent: undefined,
        selectConcernInfobox: undefined,
        citizenPortalAnamnesisEnabled: "",
        keycloakUserCleanupJobOverdueDuration: "",
        medicalOpinionCutOffDateLeadTime: "",
      };

      return {
        ...data,
        citizenPortalAnamnesisEnabled: booleanToString(
          data.citizenPortalAnamnesisEnabled,
        ),
        concerns: mapOptionalDocument(data.concerns, CustomFileType.Yaml),
        landingContent: supportedLanguages.reduce(
          (acc, lang) => {
            acc[lang] = mapOptionalDocument(
              data.landingPageContent?.localizations?.[mapToApiLanguage(lang)],
              CustomFileType.Md,
            );
            return acc;
          },
          {} as Record<SupportedLanguage, ConfigFile>,
        ),
        selectConcernInfobox: supportedLanguages.reduce(
          (acc, lang) => {
            acc[lang] = mapOptionalDocument(
              data.selectConcernInfobox?.localizations?.[
                mapToApiLanguage(lang)
              ],
              CustomFileType.Md,
            );
            return acc;
          },
          {} as Record<SupportedLanguage, ConfigFile>,
        ),
      } satisfies OfficialMedicalServiceFormModel;
    },
  });
  return result.data;
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

export function useDownloadOmsSelectConcernInfobox() {
  const api = useConfiguratorOmsApi();
  return useFileDownload((lang: ApiLanguage) =>
    api.downloadSelectConcernInfoboxRaw({ lang }),
  );
}

function mapOptionalDocument(
  file: ApiDocumentDetails | undefined | null,
  type: ApiFileType | CustomFileType,
) {
  if (!file) {
    return null;
  }
  return mapDocument(file, type);
}

function booleanToString(value: boolean | string) {
  if (typeof value === "string") {
    return "";
  }
  return value ? "true" : "false";
}

function mapDocument(
  file: ApiDocumentDetails,
  type: ApiFileType | CustomFileType,
): FileUploadValue {
  return {
    name: file.fileName,
    size: file.fileSizeBytes,
    type,
  };
}
