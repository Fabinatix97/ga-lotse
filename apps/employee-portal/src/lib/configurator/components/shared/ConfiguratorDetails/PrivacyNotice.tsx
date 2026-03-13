/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { FormikValues } from "formik";
import { notFound } from "next/navigation";
import { useMemo } from "react";

import { FileType, useFileDownload } from "@eshg/lib-portal";

import { useUpdatePrivacyNotice } from "@/lib/configurator/api/mutations/useUpdatePrivacyNotice";
import { useGetPrivacyNotice } from "@/lib/configurator/api/queries/useGetPrivacyNotice";
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
import { useConfiguratorPrivacyDocumentApi } from "@/lib/shared/api/clients";

export interface PrivacyNoticeFormModel extends FormikValues {
  useNoticeOfHealthDepartment: "DEFAULT" | "CUSTOM";
  files: Record<SupportedLanguage, ConfigFile>;
}

const UPLOAD_FIELD_MAX_WIDTH = "500px";

const endpointName: ConfiguratorEndpointName = "PRIVACY_NOTICE";

export function PrivacyNotice(props: { module: ConfiguratorModuleName }) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <PrivacyNoticeConfiguratorForm module={props.module} />;
}

function PrivacyNoticeConfiguratorForm(props: {
  module: ConfiguratorModuleName;
}) {
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });
  const result = useGetPrivacyNotice(props.module);

  const showChooser = props.module !== "BASE";

  const updatePrivacyNotice = useUpdatePrivacyNotice(props.module);

  async function onSubmit(model: PrivacyNoticeFormModel) {
    await updatePrivacyNotice(model);
  }
  const download = usePrivacyNoticeDownload(props.module);

  const sections = useMemo(() => {
    const formSections = [
      {
        content: {
          title: "Deutsch",
          type: "field",
          rows: [
            {
              fields: [
                {
                  type: "upload",
                  name: "files.de",
                  label: "Upload (PDF-Datei)",
                  accept: FileType.Pdf,
                  required: "Upload erforderlich",
                  downloadFile: () => download("de"),
                  width: { width: "100%", maxWidth: UPLOAD_FIELD_MAX_WIDTH },
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
                        name: `files.${lang}`,
                        label: "Upload (PDF-Datei)",
                        accept: FileType.Pdf,
                        downloadFile: () => download(lang),
                        width: {
                          width: "100%",
                          maxWidth: UPLOAD_FIELD_MAX_WIDTH,
                        },
                      },
                    ],
                  },
                ],
              },
            }) satisfies FormSection,
        ) satisfies FormSection[]),
    ] satisfies FormSection[];

    if (showChooser) {
      return [
        {
          content: {
            type: "choose",
            name: "useNoticeOfHealthDepartment",
            options: [
              {
                label: "Datenschutzhinweise von Grundmodul übernehmen",
                value: "DEFAULT",
                sections: [],
              },
              {
                label: "Abweichende Datenschutzhinweise hochladen",
                value: "CUSTOM",
                sections: formSections,
              },
            ],
          },
        } satisfies FormSection,
      ];
    }
    return formSections;
  }, [download, showChooser]);

  return (
    <ConfiguratorForm
      sheets={[
        {
          title: "Allgemeine Datenschutzhinweise",
          description: (
            <Typography level="body-md">
              {"Laden Sie die Datenschutzhinweise(PDF) hoch, die "}
              <Typography level="title-md">
                Bürger:innen im Online Portal
              </Typography>
              {" herunterladen können."}
            </Typography>
          ),
          sections,
        },
      ]}
      initialValues={result}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}

function usePrivacyNoticeDownload(module: ConfiguratorModuleName) {
  const { moduleApi, baseApi } = useConfiguratorPrivacyDocumentApi(module);
  async function downloadFn(supportedLanguage: SupportedLanguage) {
    const lang = mapToApiLanguage(supportedLanguage);
    return module === "BASE"
      ? baseApi.downloadPrivacyNoticeRaw({ lang })
      : moduleApi.downloadPrivacyNoticeRaw({ lang });
  }

  return useFileDownload(downloadFn).download;
}
