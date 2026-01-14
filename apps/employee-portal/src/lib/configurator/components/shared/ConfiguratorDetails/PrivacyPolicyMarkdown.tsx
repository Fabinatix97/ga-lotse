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
import { useUpdatePrivacyPolicyMarkdown } from "@/lib/shared/api/mutations/configurator/useUpdatePrivacyPolicyMarkdown";
import { useGetPrivacyPolicyMarkdownConfig } from "@/lib/shared/api/queries/configurator/privacyPolicyMarkdown";

enum FormNames {
  CITIZEN_PORTAL_PRIVACY_POLICY_DE = "citizenPortalPrivacyPolicyDe",
  CITIZEN_PORTAL_PRIVACY_POLICY_EN = "citizenPortalPrivacyPolicyEn",
  EMPLOYEE_PORTAL_PRIVACY_POLICY_DE = "employeePortalPrivacyPolicyDe",
  EMPLOYEE_PORTAL_PRIVACY_POLICY_EN = "employeePortalPrivacyPolicyEn",
}

export interface PrivacyPolicyMarkdownFormModel extends FormikValues {
  [FormNames.CITIZEN_PORTAL_PRIVACY_POLICY_DE]: ConfigFile;
  [FormNames.CITIZEN_PORTAL_PRIVACY_POLICY_EN]: ConfigFile;
  [FormNames.EMPLOYEE_PORTAL_PRIVACY_POLICY_DE]: ConfigFile;
  [FormNames.EMPLOYEE_PORTAL_PRIVACY_POLICY_EN]: ConfigFile;
}

const UPLOAD_FIELD_WIDTH = "500px";

const endpointName: ConfiguratorEndpointName =
  "PRIVACY_POLICY_MARKDOWNS_CONFIG";

export function PrivacyPolicyMarkdown(props: {
  module: ConfiguratorModuleName;
}) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <PrivacyPolicyMarkdownConfiguratorForm module={props.module} />;
}

function PrivacyPolicyMarkdownConfiguratorForm(props: {
  module: ConfiguratorModuleName;
}) {
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });
  const result = useGetPrivacyPolicyMarkdownConfig();

  const updatePrivacyPolicyMarkdown = useUpdatePrivacyPolicyMarkdown();

  async function onSubmit(model: PrivacyPolicyMarkdownFormModel) {
    await updatePrivacyPolicyMarkdown(model);
  }
  const download = usePrivacyPolicyDownload();

  return (
    <ConfiguratorForm
      sheets={[
        {
          title: "Allgemeine Datenschutzerklärung für das Online Portal",
          description: (
            <Typography level="body-md">
              {"Laden Sie die Datenschutzerklärung(Markdown) hoch, die "}
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
                        name: FormNames.CITIZEN_PORTAL_PRIVACY_POLICY_DE,
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
                        name: FormNames.CITIZEN_PORTAL_PRIVACY_POLICY_EN,
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
          title: "Allgemeine Datenschutzerklärung für das Mitarbeitendenportal",
          description: (
            <Typography level="body-md">
              {"Laden Sie die Datenschutzerklärung(Markdown) hoch, die im "}
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
                        name: FormNames.EMPLOYEE_PORTAL_PRIVACY_POLICY_DE,
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
                        name: FormNames.EMPLOYEE_PORTAL_PRIVACY_POLICY_EN,
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

function usePrivacyPolicyDownload() {
  const configApi = useDepartmentConfigurationApi();
  async function downloadFn({
    portalType,
    lang,
  }: {
    portalType: "EMPLOYEE" | "CITIZEN";
    lang: ApiLanguage;
  }) {
    const body = {
      name: ApiEmployeePortalMarkdownName.Privacy,
      lang,
    };
    return portalType === "EMPLOYEE"
      ? configApi.getEmployeeMarkdownFileRaw(body)
      : configApi.getCitizenMarkdownFileRaw(body);
  }

  return useFileDownload(downloadFn).download;
}
