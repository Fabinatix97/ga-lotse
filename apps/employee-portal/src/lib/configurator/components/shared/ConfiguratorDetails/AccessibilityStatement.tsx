/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { FormikValues } from "formik";
import { notFound } from "next/navigation";

import { ApiEmployeePortalMarkdownName } from "@eshg/base-api";
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
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";
import { useUpdateAccessibilityStatement } from "@/lib/shared/api/mutations/configurator/useUpdateAccessibilityStatement";
import { useGetAccessibilityStatements } from "@/lib/shared/api/queries/configurator/useGetAccessibilityStatements";

enum FormNames {
  CITIZEN_PORTAL_ACCESSIBILITY_STATEMENT_DE = "citizenPortalAccessibilityStatementDe",
  CITIZEN_PORTAL_ACCESSIBILITY_STATEMENT_EN = "citizenPortalAccessibilityStatementEn",
  EMPLOYEE_PORTAL_ACCESSIBILITY_STATEMENT_DE = "employeePortalAccessibilityStatementDe",
  EMPLOYEE_PORTAL_ACCESSIBILITY_STATEMENT_EN = "employeePortalAccessibilityStatementEn",
}

export interface AccessibilityStatementFormModel extends FormikValues {
  [FormNames.CITIZEN_PORTAL_ACCESSIBILITY_STATEMENT_DE]: ConfigFile;
  [FormNames.CITIZEN_PORTAL_ACCESSIBILITY_STATEMENT_EN]: ConfigFile;
  [FormNames.EMPLOYEE_PORTAL_ACCESSIBILITY_STATEMENT_DE]: ConfigFile;
  [FormNames.EMPLOYEE_PORTAL_ACCESSIBILITY_STATEMENT_EN]: ConfigFile;
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
                        name: FormNames.CITIZEN_PORTAL_ACCESSIBILITY_STATEMENT_DE,
                        label: "Upload (Markdown-Datei)",
                        required: "Upload erforderlich",
                        accept: FileType.Md,
                        downloadFile: () =>
                          download({ portalType: "CITIZEN", lang: "GERMAN" }),
                        width: { width: UPLOAD_FIELD_WIDTH },
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
                        name: FormNames.CITIZEN_PORTAL_ACCESSIBILITY_STATEMENT_EN,
                        label: "Upload (Markdown-Datei)",
                        accept: FileType.Md,
                        downloadFile: () =>
                          download({ portalType: "CITIZEN", lang: "ENGLISH" }),
                        width: { width: UPLOAD_FIELD_WIDTH },
                      },
                    ],
                  },
                ],
              },
            },
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
                        name: FormNames.EMPLOYEE_PORTAL_ACCESSIBILITY_STATEMENT_DE,
                        label: "Upload (Markdown-Datei)",
                        required: "Upload erforderlich",
                        accept: FileType.Md,
                        downloadFile: () =>
                          download({ portalType: "EMPLOYEE", lang: "GERMAN" }),
                        width: { width: UPLOAD_FIELD_WIDTH },
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
                        name: FormNames.EMPLOYEE_PORTAL_ACCESSIBILITY_STATEMENT_EN,
                        label: "Upload (Markdown-Datei)",
                        accept: FileType.Md,
                        downloadFile: () =>
                          download({ portalType: "EMPLOYEE", lang: "ENGLISH" }),
                        width: { width: UPLOAD_FIELD_WIDTH },
                      },
                    ],
                  },
                ],
              },
            },
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
    lang,
  }: {
    portalType: "EMPLOYEE" | "CITIZEN";
    lang: ApiLanguage;
  }) {
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
