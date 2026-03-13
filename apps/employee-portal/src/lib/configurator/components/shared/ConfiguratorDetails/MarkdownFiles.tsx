/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import assert from "assert";

import {
  ApiCitizenPortalMarkdownName,
  ApiEmployeePortalMarkdownName,
  ApiMultiLangDocument,
} from "@eshg/base-api";
import { FileType } from "@eshg/lib-portal";

import {
  useGetCitizenMarkdownFile,
  useGetEmployeeMarkdownFile,
} from "@/lib/configurator/api/queries/markdown";
import {
  ConfiguratorForm,
  FormSection,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
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
  SupportedLanguage,
  languageLabel,
  mapToApiLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";

type MarkdownFileData = Partial<Record<SupportedLanguage, ConfigFile>>;

export interface MarkdownFormData {
  markdownFiles: MarkdownFileData;
}

function getInitialValues(
  markdownFiles?: ApiMultiLangDocument,
): MarkdownFormData {
  return {
    markdownFiles: supportedLanguages.reduce((acc, key) => {
      acc[key] = markdownFiles?.localizations?.[mapToApiLanguage(key)]
        ? {
            name: markdownFiles.localizations[mapToApiLanguage(key)]!.fileName,
            size: markdownFiles.localizations[mapToApiLanguage(key)]!
              .fileSizeBytes,
            type: "MD",
          }
        : null;

      return acc;
    }, {} as MarkdownFileData),
  };
}

export type UpdateMarkdownRequest = { de: ConfigFile } & Partial<
  Record<SupportedLanguage, ConfigFile>
>;

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
    assert.ok(markdownFiles.de, "German language file required");
    await props.updateMarkdown({
      de: markdownFiles.de,
      ...markdownFiles,
    });
  }

  const title = getTabNamesByEndpointName(props.module, props.endpointName);
  const description = getDescription(props.endpointName);

  function downloadFileNow(supportedLanguage: SupportedLanguage) {
    const lang = mapToApiLanguage(supportedLanguage);
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
                        downloadFile: () => downloadFileNow("de"),
                        name: `markdownFiles.de`,
                        required: "Bitte ausfüllen",
                        ...MARKDOWN_UPLOAD_FIELD_PROPS,
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
                              downloadFile: () => downloadFileNow(lang),
                              name: `markdownFiles.${lang}`,
                              ...MARKDOWN_UPLOAD_FIELD_PROPS,
                            },
                          ],
                        },
                      ],
                    },
                  }) satisfies FormSection,
              ) satisfies FormSection[]),
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
