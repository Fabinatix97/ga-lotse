/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { notFound } from "next/navigation";

import { validateURL } from "@eshg/lib-employee-portal";
import { FileType, useFileDownload } from "@eshg/lib-portal";

import { useUpdateOpenData } from "@/lib/configurator/api/mutations/useUpdateOpenData";
import { useGetOpenDataConfig } from "@/lib/configurator/api/queries/openData";
import {
  ConfiguratorForm,
  FormSection,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { isEndpointSupportedByModule } from "@/lib/configurator/shared/config";
import {
  ConfiguratorEndpointName,
  ConfiguratorModuleName,
} from "@/lib/configurator/shared/types";
import {
  SupportedLanguage,
  languageLabel,
  mapToApiLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";
import { useOpenDataConfigApi } from "@/lib/shared/api/clients";

enum FormNames {
  OPEN_DATA_LICENCE_URL = "openDataLicenceUrl",
  OPEN_DATA_AUTHOR = "openDataAuthor",
}

export interface OpenDataFormModel extends FormikValues {
  termsOfUse: Record<SupportedLanguage, ConfigFile>;
  [FormNames.OPEN_DATA_LICENCE_URL]: string;
  [FormNames.OPEN_DATA_AUTHOR]: string;
}

const UPLOAD_FIELD_WIDTH = "500px";

const endpointName: ConfiguratorEndpointName = "OPEN_DATA";

export function OpenData(props: { module: ConfiguratorModuleName }) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <OpenDataConfiguratorForm module={props.module} />;
}

function OpenDataConfiguratorForm(props: { module: ConfiguratorModuleName }) {
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });

  const result = useGetOpenDataConfig();

  const updateOpenData = useUpdateOpenData();

  async function onSubmit(model: OpenDataFormModel) {
    await updateOpenData(model);
  }
  const download = useTermsOfUseDownload();

  return (
    <ConfiguratorForm
      sheets={[
        {
          title: "Nutzungsbedingungen",
          sections: [
            {
              content: {
                title: "Deutsch",
                type: "field",
                rows: [
                  {
                    fields: [
                      {
                        type: "upload",
                        name: "termsOfUse.de",
                        label: "Upload (Markdown-Datei)",
                        required: "Upload erforderlich",
                        downloadFile: () => download("de"),
                        width: { width: UPLOAD_FIELD_WIDTH },
                        accept: FileType.Md,
                      },
                    ],
                  },
                ],
              },
            },
            ...(supportedLanguages
              .filter((lang) => lang !== "de")
              .map(
                (lang) =>
                  ({
                    content: {
                      type: "field",
                      title: languageLabel[lang],
                      rows: [
                        {
                          fields: [
                            {
                              type: "upload",
                              name: `termsOfUse.${lang}`,
                              label: "Upload (Markdown-Datei)",
                              accept: FileType.Md,
                              downloadFile: () => download(lang),
                              width: { width: UPLOAD_FIELD_WIDTH },
                            },
                          ],
                        },
                      ],
                    },
                  }) satisfies FormSection,
              ) satisfies FormSection[]),
          ],
        },
        {
          title: "Angaben zu Lizensierung und Autor",
          sections: [
            {
              content: {
                type: "field",
                rows: [
                  {
                    fields: [
                      {
                        type: "text",
                        name: FormNames.OPEN_DATA_LICENCE_URL,
                        label: "Lizenz",
                        required: "Angabe erforderlich",
                        placeholder:
                          "z.B. https://creativecommons.org/licenses/by/4.0/deed.de",
                        validate: validateURL,
                      },
                    ],
                  },
                ],
              },
            },
            {
              content: {
                type: "field",
                rows: [
                  {
                    fields: [
                      {
                        type: "text",
                        name: FormNames.OPEN_DATA_AUTHOR,
                        label: "Autor",
                        required: "Angabe erforderlich",
                        placeholder: "z.B. GA Frankfurt",
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ]}
      initialValues={result.data.values}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}

function useTermsOfUseDownload() {
  const openDataConfigApi = useOpenDataConfigApi();
  async function downloadFn(supportedLanguage: SupportedLanguage) {
    const lang = mapToApiLanguage(supportedLanguage);
    return openDataConfigApi.downloadTermsOfUseRaw({ lang });
  }

  return useFileDownload(downloadFn).download;
}
