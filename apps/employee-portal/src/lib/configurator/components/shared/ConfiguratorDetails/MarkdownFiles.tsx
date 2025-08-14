/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import assert from "assert";

import {
  ApiCitizenPortalMarkdownName,
  ApiEmployeePortalMarkdownName,
  ApiLanguage,
  ApiMultiLangDocument,
} from "@eshg/base-api";
import { FileType } from "@eshg/lib-portal";

import { ConfiguratorForm } from "@/lib/configurator/components/shared/ConfiguratorForm";
import {
  ConfigFile,
  FormFields,
} from "@/lib/configurator/components/shared/RenderField";
import { getTabNamesByEndpointName } from "@/lib/configurator/components/shared/configuratorNameMapping";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import {
  ConfiguratorEndpointName,
  ConfiguratorModuleName,
} from "@/lib/configurator/shared/types";
import {
  useGetCitizenMarkdownFile,
  useGetEmployeeMarkdownFile,
} from "@/lib/shared/api/queries/configurator/markdown";

type Language = keyof ApiMultiLangDocument;
type MarkdownFileData = Record<Language, ConfigFile>;

export interface MarkdownFormData {
  markdownFiles: MarkdownFileData;
}

function getInitialValues(
  markdownFiles?: ApiMultiLangDocument,
): MarkdownFormData {
  return {
    markdownFiles: {
      de: markdownFiles?.de
        ? {
            name: markdownFiles?.de.fileName,
            size: markdownFiles.de.fileSizeBytes,
            type: "MD",
          }
        : null,
      en: markdownFiles?.en
        ? {
            name: markdownFiles?.en.fileName,
            size: markdownFiles.en.fileSizeBytes,
            type: "MD",
          }
        : null,
    },
  };
}

export interface UpdateMarkdownRequest {
  de: ConfigFile;
  en?: ConfigFile;
}

type PortalType = "EMPLOYEE" | "CITIZEN";
type PortalMarkdownName<T extends PortalType> = T extends "EMPLOYEE"
  ? ApiEmployeePortalMarkdownName
  : ApiCitizenPortalMarkdownName;

function getDescription(
  endpointName: ConfiguratorEndpointName,
): string | undefined {
  switch (endpointName) {
    case "IMPRINT_MARKDOWNS_CONFIG":
      return "Das Impressum wird im Online Portal angezeigt.";
    case "CONTACT_MARKDOWNS_CONFIG":
      return "Definieren Sie die Inhalte, die auf der Kontakt-Seite im Mitarbeitendenportal angezeigt werden.";
    default:
      return undefined;
  }
}

export function MarkdownFiles<T extends PortalType>(props: {
  portalType: T;
  module: ConfiguratorModuleName;
  endpointName: ConfiguratorEndpointName;
  fileName: PortalMarkdownName<T>;
  markdownFiles: ApiMultiLangDocument | undefined;
  updateMarkdown: (u: UpdateMarkdownRequest) => Promise<void>;
}) {
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName: props.endpointName,
  });

  const markdownFiles = props.markdownFiles;
  const initialValues = getInitialValues(markdownFiles);

  const citizenFileDownload = useGetCitizenMarkdownFile();
  const employeeFileDownload = useGetEmployeeMarkdownFile();

  async function onSubmit({ markdownFiles }: MarkdownFormData) {
    const { de, en } = markdownFiles;

    assert.ok(de, "German language file required");

    const updateMarkdownRequest = { de, en };

    await props.updateMarkdown(updateMarkdownRequest);
  }

  const title = getTabNamesByEndpointName(props.module, props.endpointName);
  const description = getDescription(props.endpointName);

  function downloadFileNow(lang: ApiLanguage) {
    if (props.portalType === "EMPLOYEE") {
      void employeeFileDownload.download({
        name: props.fileName as ApiEmployeePortalMarkdownName,
        lang,
      });
    } else {
      void citizenFileDownload.download({
        name: props.fileName as ApiCitizenPortalMarkdownName,
        lang,
      });
    }
  }

  return (
    <ConfiguratorForm
      sheets={[
        {
          title,
          description: description ? (
            <Typography level="body-md">{description}</Typography>
          ) : undefined,
          sections: [
            {
              title: "Deutsch",
              content: {
                type: "field",
                rows: [
                  {
                    fields: [
                      {
                        downloadFile: () => downloadFileNow(ApiLanguage.German),
                        name: `markdownFiles.de`,
                        required: "Bitte ausfüllen",
                        ...MARKDOWN_UPLOAD_FIELD_PROPS,
                      },
                    ],
                  },
                ],
              },
            },
            {
              title: "Englisch",
              content: {
                type: "field",
                rows: [
                  {
                    fields: [
                      {
                        downloadFile: () =>
                          downloadFileNow(ApiLanguage.English),
                        name: `markdownFiles.en`,
                        ...MARKDOWN_UPLOAD_FIELD_PROPS,
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ]}
      initialValues={initialValues}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}

const UPLOAD_FIELD_MAX_WIDTH = "500px";

const MARKDOWN_UPLOAD_FIELD_PROPS = {
  type: "upload",
  label: "Upload (Markdown-Datei)",
  accept: FileType.Md,
  width: { width: "100%", maxWidth: UPLOAD_FIELD_MAX_WIDTH },
} as const satisfies Partial<FormFields>;
