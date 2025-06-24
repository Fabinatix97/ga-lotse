/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { FormikValues } from "formik";
import { notFound } from "next/navigation";
import { useMemo } from "react";

import { ApiLanguage } from "@eshg/lib-config-api";
import { FileType, useFileDownload } from "@eshg/lib-portal";

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
import { useConfiguratorPrivacyDocumentApi } from "@/lib/shared/api/clients";
import { useUpdatePrivacyNotice } from "@/lib/shared/api/mutations/configurator/useUpdatePrivacyNotice";
import { useGetPrivacyNotice } from "@/lib/shared/api/queries/configurator/useGetPrivacyNotice";

enum FormNames {
  USE_NOTICE_OF_HEALTH_DEPARTMENT = "useNoticeOfHealthDepartment",
  GERMAN_PRIVACY_NOTICE_DOCUMENT = "germanPrivacyNoticeDocument",
  ENGLISH_PRIVACY_NOTICE_DOCUMENT = "englishPrivacyNoticeDocument",
}

export interface PrivacyNoticeFormModel extends FormikValues {
  [FormNames.USE_NOTICE_OF_HEALTH_DEPARTMENT]: "DEFAULT" | "CUSTOM";
  [FormNames.GERMAN_PRIVACY_NOTICE_DOCUMENT]: ConfigFile;
  [FormNames.ENGLISH_PRIVACY_NOTICE_DOCUMENT]: ConfigFile;
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
                  name: FormNames.GERMAN_PRIVACY_NOTICE_DOCUMENT,
                  label: "Upload (PDF-Datei)",
                  accept: FileType.Pdf,
                  required: "Upload erforderlich",
                  downloadFile: () => download("GERMAN"),
                  width: { width: "100%", maxWidth: UPLOAD_FIELD_MAX_WIDTH },
                },
              ],
            },
          ],
        },
      },
      {
        content: {
          type: "field",
          title: "Englisch",
          rows: [
            {
              fields: [
                {
                  type: "upload",
                  name: FormNames.ENGLISH_PRIVACY_NOTICE_DOCUMENT,
                  label: "Upload (PDF-Datei)",
                  accept: FileType.Pdf,
                  downloadFile: () => download("ENGLISH"),
                  width: { width: "100%", maxWidth: UPLOAD_FIELD_MAX_WIDTH },
                },
              ],
            },
          ],
        },
      },
    ] satisfies FormSection[];

    if (showChooser) {
      return [
        {
          content: {
            type: "choose",
            name: FormNames.USE_NOTICE_OF_HEALTH_DEPARTMENT,
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
  async function downloadFn(lang: ApiLanguage) {
    return module === "BASE"
      ? baseApi.downloadPrivacyNoticeRaw({ lang })
      : moduleApi.downloadPrivacyNoticeRaw({ lang });
  }

  return useFileDownload(downloadFn).download;
}
