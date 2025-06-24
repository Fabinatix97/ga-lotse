/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { validateURL } from "next/dist/server/web/utils";
import { notFound } from "next/navigation";

import { ApiLanguage } from "@eshg/lib-config-api";
import { FileType, useFileDownload } from "@eshg/lib-portal";

import { ConfiguratorForm } from "@/lib/configurator/components/shared/ConfiguratorForm";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { isEndpointSupportedByModule } from "@/lib/configurator/shared/config";
import {
  ConfiguratorEndpointName,
  ConfiguratorModuleName,
} from "@/lib/configurator/shared/types";
import { useOpenDataConfigApi } from "@/lib/shared/api/clients";
import { useUpdateOpenData } from "@/lib/shared/api/mutations/configurator/useUpdateOpenData";
import { useGetOpenDataConfig } from "@/lib/shared/api/queries/configurator/openData";

enum FormNames {
  OPEN_DATA_TERMS_OF_USE_DE = "openDataTermsOfUseDe",
  OPEN_DATA_TERMS_OF_USE_EN = "openDataTermsOfUseEn",
  OPEN_DATA_LICENCE_URL = "openDataLicenceUrl",
  OPEN_DATA_AUTHOR = "openDataAuthor",
}

export interface OpenDataFormModel extends FormikValues {
  [FormNames.OPEN_DATA_TERMS_OF_USE_DE]: ConfigFile;
  [FormNames.OPEN_DATA_TERMS_OF_USE_EN]: ConfigFile;
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
                        name: FormNames.OPEN_DATA_TERMS_OF_USE_DE,
                        label: "Upload (Markdown-Datei)",
                        required: "Upload erforderlich",
                        downloadFile: () => download("GERMAN"),
                        width: { width: UPLOAD_FIELD_WIDTH },
                        accept: FileType.Md,
                      },
                    ],
                  },
                ],
              },
            },
            {
              content: {
                title: "Englisch",
                type: "field",
                rows: [
                  {
                    fields: [
                      {
                        type: "upload",
                        name: FormNames.OPEN_DATA_TERMS_OF_USE_EN,
                        label: "Upload (Markdown-Datei)",
                        downloadFile: () => download("ENGLISH"),
                        width: { width: UPLOAD_FIELD_WIDTH },
                        accept: FileType.Md,
                      },
                    ],
                  },
                ],
              },
            },
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
  async function downloadFn(lang: ApiLanguage) {
    return openDataConfigApi.downloadTermsOfUseRaw({ lang });
  }

  return useFileDownload(downloadFn).download;
}
