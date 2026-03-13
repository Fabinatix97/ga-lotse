/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { FormikValues } from "formik";
import { notFound } from "next/navigation";
import { useMemo } from "react";

import { FileType, useFileDownload } from "@eshg/lib-portal";

import { useUpdatePrivacyPolicy } from "@/lib/configurator/api/mutations/useUpdatePrivacyPolicy";
import { useGetPrivacyPolicy } from "@/lib/configurator/api/queries/privacyPolicy";
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

export interface PrivacyPolicyFormModel extends FormikValues {
  usePolicyOfHealthDepartment: "DEFAULT" | "CUSTOM";
  privacyPolicies: Record<SupportedLanguage, ConfigFile>;
}

const UPLOAD_FIELD_MAX_WIDTH = "500px";

const endpointName: ConfiguratorEndpointName = "PRIVACY_POLICY";

export function PrivacyPolicy(props: { module: ConfiguratorModuleName }) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <PrivacyPolicyConfiguratorForm module={props.module} />;
}

function PrivacyPolicyConfiguratorForm(props: {
  module: ConfiguratorModuleName;
}) {
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });
  const result = useGetPrivacyPolicy(props.module);

  const showChooser = props.module !== "BASE";

  const updatePrivacyPolicy = useUpdatePrivacyPolicy(props.module);

  async function onSubmit(model: PrivacyPolicyFormModel) {
    await updatePrivacyPolicy(model);
  }
  const download = usePrivacyPolicyDownload(props.module);

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
                  name: "privacyPolicies.de",
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
                        name: `privacyPolicies.${lang}`,
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
            name: "usePolicyOfHealthDepartment",
            options: [
              {
                label: "Datenschutzerklärung von Grundmodul übernehmen",
                value: "DEFAULT",
                sections: [],
              },
              {
                label: "Abweichende Datenschutzerklärung hochladen",
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
          title:
            props.module === "BASE"
              ? "Allgemeine Datenschutzerklärung für das Online-Portal"
              : "Datenschutzerklärung",
          description: (
            <Typography level="body-md">
              {"Laden Sie die Datenschutzerklärung(PDF) hoch, die "}
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

function usePrivacyPolicyDownload(module: ConfiguratorModuleName) {
  const { moduleApi, baseApi } = useConfiguratorPrivacyDocumentApi(module);
  async function downloadFn(supportedLang: SupportedLanguage) {
    const lang = mapToApiLanguage(supportedLang);
    return module === "BASE"
      ? baseApi.downloadPrivacyPolicyRaw({ lang })
      : moduleApi.downloadPrivacyPolicyRaw({ lang });
  }

  return useFileDownload(downloadFn).download;
}
