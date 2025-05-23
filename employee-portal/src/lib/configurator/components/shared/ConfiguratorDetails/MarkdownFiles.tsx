/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileDownloadOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";
import assert from "assert";
import { MouseEvent } from "react";

import {
  ApiCitizenPortalMarkdownName,
  ApiEmployeePortalMarkdownName,
  ApiInternationalMarkdownInfo,
  ApiLanguage,
  UpdateAcknowledgementsMarkdownRequest,
  UpdateImprintMarkdownRequest,
  UpdatePrivacyMarkdownRequest,
} from "@eshg/base-api";
import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { FileType } from "@eshg/lib-portal/components/formFields/file/types";

import {
  ConfiguratorForm,
  FormSheet,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
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

const Portal = {
  citizen: "citizen",
  employee: "employee",
} as const;
type Portal = keyof typeof Portal;

interface MarkdownFile {
  file: Blob | null;
  required: boolean;
}

type Language = keyof ApiInternationalMarkdownInfo;
const Language = {
  de: "de",
  en: "en",
} as const satisfies Record<string, Language>;

type MarkdownFormMode = "single" | "split";
type MarkdownFileData<T extends MarkdownFormMode> = T extends "single"
  ? Record<Language, MarkdownFile>
  : Record<Portal, MarkdownFileData<"single">>;

interface MarkdownFormData<T extends MarkdownFormMode> {
  markdownFiles: MarkdownFileData<T>;
}

type MarkdownInfo<T extends MarkdownFormMode> = T extends "single"
  ? ApiInternationalMarkdownInfo
  : Record<Portal, ApiInternationalMarkdownInfo>;

function singleInitialValues(): MarkdownFormData<"single"> {
  return {
    markdownFiles: {
      de: { file: null, required: true },
      en: { file: null, required: false },
    },
  };
}
function splitInitialValues(): MarkdownFormData<"split"> {
  return {
    markdownFiles: {
      citizen: singleInitialValues().markdownFiles,
      employee: singleInitialValues().markdownFiles,
    },
  };
}

type UpdateMarkdownRequest<T extends MarkdownFormMode> = T extends "single"
  ? UpdateImprintMarkdownRequest | UpdateAcknowledgementsMarkdownRequest
  : UpdatePrivacyMarkdownRequest;
export function MarkdownFiles<T extends MarkdownFormMode>(props: {
  mode: T;
  module: ConfiguratorModuleName;
  endpointName: ConfiguratorEndpointName;
  fileName: DownloadFileNameForMode<T>;
  markdownFiles: MarkdownInfo<T> | undefined;
  updateMarkdown: (u: UpdateMarkdownRequest<T>) => Promise<void>;
}) {
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName: props.endpointName,
  });

  const markdownFiles = props.markdownFiles;
  const initialValues = (
    props.mode === "single" ? singleInitialValues() : splitInitialValues()
  ) as MarkdownFormData<T>;

  const citizenFileDownload = useGetCitizenMarkdownFile();
  const employeeFileDownload = useGetEmployeeMarkdownFile();

  async function onSubmit({ markdownFiles }: MarkdownFormData<T>) {
    if (props.mode === "single") {
      const { de, en } =
        markdownFiles as MarkdownFormData<"single">["markdownFiles"];

      assert.ok(de.file, "Eine deutsche Markdown-Datei ist erforderlich");

      const updateMarkdownRequest = {
        de: de.file,
        en: en.file ?? undefined,
      } as UpdateMarkdownRequest<T>;

      await props.updateMarkdown(updateMarkdownRequest);
    } else {
      throw Error("Split not yet implemented");
    }
  }

  const title = getTabNamesByEndpointName(props.module, props.endpointName);

  return (
    <ConfiguratorForm
      sheets={
        props.mode === "single"
          ? [
              singleSheet<"citizen">({
                title,
                markdownFiles: markdownFiles as MarkdownInfo<"single">,
                downloadFile: citizenFileDownload.download,
                fileName: props.fileName,
              }),
            ]
          : sheetPerPortal({
              title,
              markdownFiles: markdownFiles as MarkdownInfo<"split">,
              citizenDownloadFile: citizenFileDownload.download,
              employeeDownloadFile: employeeFileDownload.download,
              fileName: props.fileName as SplitFileName,
            })
      }
      initialValues={initialValues}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}

type SplitFileName = ApiCitizenPortalMarkdownName &
  ApiEmployeePortalMarkdownName;

type DownloadFileNameForMode<T extends MarkdownFormMode> = T extends "single"
  ? ApiCitizenPortalMarkdownName
  : SplitFileName;
type DownloadFileName<T extends Portal> = T extends "citizen"
  ? ApiCitizenPortalMarkdownName
  : ApiEmployeePortalMarkdownName;
type DownloadFile<T extends Portal> = (arg: {
  name: DownloadFileName<T>;
  lang: ApiLanguage;
}) => Promise<void>;
function singleSheet<T extends Portal = "citizen">({
  title,
  portal,
  markdownFiles,
  downloadFile,
  fileName,
}: {
  title: string;
  portal?: Portal;
  markdownFiles: MarkdownInfo<"single"> | undefined;
  downloadFile: DownloadFile<T>;
  fileName: DownloadFileName<T>;
}): FormSheet {
  const prefix = portal ? `.${portal}` : "";

  function downloadFileNow(lang: ApiLanguage) {
    if (markdownFiles?.de.fileName == null) {
      return;
    }
    void downloadFile({
      name: fileName,
      lang,
    });
  }

  return {
    title,
    sections: [
      {
        title: "Deutsch",
        description: (
          <CurrentFileLabel
            markdownInfo={markdownFiles}
            language={Language.de}
            onClick={() => {
              downloadFileNow(ApiLanguage.German);
            }}
          />
        ),
        content: {
          type: "field",
          rows: [
            {
              fields: [
                {
                  downloadFile() {
                    throw Error("Not implemented");
                  },
                  type: "upload",
                  label: "Upload (Markdown-Datei)",
                  name: `markdownFiles${prefix}.de.file`,
                  required: "Bitte ausfüllen",
                  accept: [FileType.Md],
                },
              ],
            },
          ],
        },
      },
      {
        title: "Englisch",
        description: (
          <CurrentFileLabel
            markdownInfo={markdownFiles}
            language={Language.en}
            onClick={() => {
              downloadFileNow(ApiLanguage.English);
            }}
          />
        ),
        content: {
          type: "field",
          rows: [
            {
              fields: [
                {
                  downloadFile() {
                    throw Error("Not implemented");
                  },
                  type: "upload",
                  label: "Upload (Markdown-Datei)",
                  name: `markdownFiles${prefix}.en.file`,
                  accept: [FileType.Md],
                },
              ],
            },
          ],
        },
      },
    ],
  };
}

function sheetPerPortal({
  title,
  markdownFiles,
  citizenDownloadFile,
  employeeDownloadFile,
  fileName,
}: {
  title: string;
  markdownFiles: MarkdownInfo<"split"> | undefined;
  citizenDownloadFile: DownloadFile<"citizen">;
  employeeDownloadFile: DownloadFile<"employee">;
  fileName: SplitFileName;
}): FormSheet[] {
  return [
    singleSheet({
      title: `${title} für das Online Portal`,
      portal: Portal.citizen,
      markdownFiles: markdownFiles?.[Portal.citizen],
      downloadFile: citizenDownloadFile,
      fileName,
    }),
    singleSheet({
      title: `${title} für das Mitarbeitendenportal`,
      portal: Portal.employee,
      markdownFiles: markdownFiles?.[Portal.employee],
      downloadFile: employeeDownloadFile,
      fileName,
    }),
  ];
}

function CurrentFileLabel({
  markdownInfo,
  language,
  onClick,
}: {
  markdownInfo?: ApiInternationalMarkdownInfo;
  language: Language;
  onClick?: () => void;
}) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (onClick == null) {
      return;
    }
    e.preventDefault();
    onClick();
  }
  const data = markdownInfo?.[language];
  const downloadButton = (
    <ButtonLink
      startDecorator={<FileDownloadOutlined />}
      fontSize="sm"
      onClick={handleClick}
    >
      {data?.fileName}
    </ButtonLink>
  );

  return (
    <Typography level="body-xs">
      <Typography fontWeight={500}>Aktuelle Datei: </Typography>
      {data ? downloadButton : "Keine Datei vorhanden"}
    </Typography>
  );
}
