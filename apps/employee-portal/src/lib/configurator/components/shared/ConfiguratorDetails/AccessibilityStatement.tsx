/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { FormikValues } from "formik";
import { notFound } from "next/navigation";

import { ApiEmployeePortalMarkdownName } from "@eshg/base-api";
import { FileType, useFileDownload } from "@eshg/lib-portal";

import { useUpdateAccessibilityStatement } from "@/lib/configurator/api/mutations/useUpdateAccessibilityStatement";
import { useGetAccessibilityStatements } from "@/lib/configurator/api/queries/useGetAccessibilityStatements";
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
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";

export interface AccessibilityStatementFormModel extends FormikValues {
  citizen: Record<SupportedLanguage, ConfigFile>;
  employee: Record<SupportedLanguage, ConfigFile>;
}

const UPLOAD_FIELD_WIDTH = "500px";

const endpointName: ConfiguratorEndpointName =
  "ACCESSIBILITY_STATEMENT_MARKDOWNS_CONFIG";

export function AccessibilityStatement(props: {
  module: ConfiguratorModuleName;
}) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <AccessibilityStatementConfiguratorForm module={props.module} />;
}

function AccessibilityStatementConfiguratorForm(props: {
  module: ConfiguratorModuleName;
}) {
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });
  const result = useGetAccessibilityStatements();

  const updateAccessibilityStatement = useUpdateAccessibilityStatement();

  async function onSubmit(model: AccessibilityStatementFormModel) {
    await updateAccessibilityStatement(model);
  }
  const download = useAccessibilityStatementDownload();

  return (
    <ConfiguratorForm
      sheets={[
        {
          title: "Barrierefreiheitserklärung für das Online Portal",
          description: (
            <Typography level="body-md">
              {"Laden Sie die Barrierefreiheitserklärung hoch, die "}
              <Typography level="title-md">
                Bürger:innen im Online Portal
              </Typography>
              {" angezeigt wird."}
            </Typography>
          ),
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
                        name: "citizen.de",
                        label: "Upload (Markdown-Datei)",
                        required: "Upload erforderlich",
                        accept: FileType.Md,
                        downloadFile: () =>
                          download({
                            portalType: "CITIZEN",
                            supportedLanguage: "de",
                          }),
                        width: { width: UPLOAD_FIELD_WIDTH },
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
                              name: `citizen.${lang}`,
                              label: "Upload (Markdown-Datei)",
                              accept: FileType.Md,
                              downloadFile: () =>
                                download({
                                  portalType: "CITIZEN",
                                  supportedLanguage: lang,
                                }),
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
          title: "Barrierefreiheitserklärung für das Mitarbeitendenportal",
          description: (
            <Typography level="body-md">
              {"Laden Sie die Barrierefreiheitserklärung hoch, die im "}
              <Typography level="title-md">Mitarbeitendenportal</Typography>
              {" angezeigt wird."}
            </Typography>
          ),
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
                        name: "employee.de",
                        label: "Upload (Markdown-Datei)",
                        required: "Upload erforderlich",
                        accept: FileType.Md,
                        downloadFile: () =>
                          download({
                            portalType: "EMPLOYEE",
                            supportedLanguage: "de",
                          }),
                        width: { width: UPLOAD_FIELD_WIDTH },
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
                              name: `employee.${lang}`,
                              label: "Upload (Markdown-Datei)",
                              accept: FileType.Md,
                              downloadFile: () =>
                                download({
                                  portalType: "EMPLOYEE",
                                  supportedLanguage: lang,
                                }),
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
      ]}
      initialValues={result}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}

function useAccessibilityStatementDownload() {
  const configApi = useDepartmentConfigurationApi();
  async function downloadFn({
    portalType,
    supportedLanguage,
  }: {
    portalType: "EMPLOYEE" | "CITIZEN";
    supportedLanguage: SupportedLanguage;
  }) {
    const lang = mapToApiLanguage(supportedLanguage);
    const body = {
      name: ApiEmployeePortalMarkdownName.Accessibility,
      lang,
    };
    return portalType === "EMPLOYEE"
      ? configApi.getEmployeeMarkdownFileRaw(body)
      : configApi.getCitizenMarkdownFileRaw(body);
  }

  return useFileDownload(downloadFn).download;
}
