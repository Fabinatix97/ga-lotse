/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors } from "formik";
import { notFound } from "next/navigation";
import { useMemo } from "react";

import { ApiDocumentDetails, ApiLanguage } from "@eshg/base-api";
import { CustomFileType } from "@eshg/lib-employee-portal";
import { FileType } from "@eshg/lib-portal";
import { ApiFileType } from "@eshg/lib-procedures-api";

import {
  ConfiguratorForm,
  FormSection,
  FormSheet,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
import {
  ConfigFile,
  FileUploadValue,
  FormFields,
} from "@/lib/configurator/components/shared/RenderField";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { isEndpointSupportedByModule } from "@/lib/configurator/shared/config";
import {
  ConfiguratorEndpointName,
  ConfiguratorModuleName,
} from "@/lib/configurator/shared/types";
import { useUpdateOms } from "@/lib/shared/api/mutations/configurator/useUpdateOms";
import {
  useDownloadOmsConcerns,
  useDownloadOmsLandingPage,
  useDownloadOmsSelectConcernInfobox,
  useGetOmsConfig,
} from "@/lib/shared/api/queries/configurator/officialMedicalService";

export interface OfficialMedicalServiceFormModel {
  keycloakUserCleanupJobOverdueDuration: number | string;
  medicalOpinionCutOffDateLeadTime: number | string;
  citizenPortalAnamnesisEnabled: "true" | "false" | "";
  concerns: ConfigFile;
  landingContentDe: ConfigFile;
  landingContentEn: ConfigFile;
  selectConcernInfoboxDe: ConfigFile;
  selectConcernInfoboxEn: ConfigFile;
}

const endpointName: ConfiguratorEndpointName = "OFFICIAL_MEDICAL_SERVICE";

export function OfficialMedicalService(props: {
  module: ConfiguratorModuleName;
}) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <OfficialMedicalServiceConfiguratorForm module={props.module} />;
}

function OfficialMedicalServiceConfiguratorForm(props: {
  module: ConfiguratorModuleName;
}) {
  const { data } = useGetOmsConfig();
  const { mutateAsync: updateOms } = useUpdateOms();
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });
  const sheets = useOmsSheets();

  async function handleSubmit({
    concerns,
    landingContentDe,
    landingContentEn,
    selectConcernInfoboxDe,
    selectConcernInfoboxEn,
    citizenPortalAnamnesisEnabled,
    keycloakUserCleanupJobOverdueDuration,
    medicalOpinionCutOffDateLeadTime,
  }: OfficialMedicalServiceFormModel) {
    await updateOms({
      concerns: mapFileToRequest(concerns),
      landingContentDe: mapFileToRequest(landingContentDe),
      landingContentEn: mapFileToRequest(landingContentEn),
      deleteLandingPageEn: landingContentEn === null,
      selectConcernInfoboxDe: mapFileToRequest(selectConcernInfoboxDe),
      selectConcernInfoboxEn: mapFileToRequest(selectConcernInfoboxEn),
      deleteSelectConcernInfoboxEn: selectConcernInfoboxEn === null,
      deleteSelectConcernInfoboxDe: selectConcernInfoboxDe === null,
      citizenPortalAnamnesisEnabled: citizenPortalAnamnesisEnabled === "true",
      keycloakUserCleanupJobOverdueDuration:
        +keycloakUserCleanupJobOverdueDuration,
      medicalOpinionCutOffDateLeadTime: +medicalOpinionCutOffDateLeadTime,
    });
  }

  function validate({
    selectConcernInfoboxDe,
    selectConcernInfoboxEn,
  }: OfficialMedicalServiceFormModel) {
    const errors: FormikErrors<OfficialMedicalServiceFormModel> = {};
    if (selectConcernInfoboxDe === null && selectConcernInfoboxEn !== null) {
      errors.selectConcernInfoboxDe =
        "Die deutsche Übersetzung ist erforderlich wenn eine englische Übersetzung vorhanden ist.";
    }
    return errors;
  }

  return (
    <ConfiguratorForm
      sheets={sheets}
      initialValues={{
        ...data,
        citizenPortalAnamnesisEnabled: booleanToString(
          data.citizenPortalAnamnesisEnabled,
        ),
        concerns: mapOptionalDocument(data.concerns, CustomFileType.Yaml),
        landingContentDe: mapOptionalDocument(
          data.landingPageContent?.de,
          CustomFileType.Md,
        ),
        landingContentEn: mapOptionalDocument(
          data.landingPageContent?.en,
          CustomFileType.Md,
        ),
        selectConcernInfoboxDe: mapOptionalDocument(
          data.selectConcernInfobox?.de,
          CustomFileType.Md,
        ),
        selectConcernInfoboxEn: mapOptionalDocument(
          data.selectConcernInfobox?.en,
          CustomFileType.Md,
        ),
      }}
      status={currentTabStatus}
      validate={validate}
      onSubmit={handleSubmit}
    />
  );
}

function useOmsSheets() {
  const { download: downloadConcerns } = useDownloadOmsConcerns();
  const { download: downloadLandingPage } = useDownloadOmsLandingPage();
  const { download: downloadSelectConcernInfobox } =
    useDownloadOmsSelectConcernInfobox();

  return useMemo(
    () =>
      [
        {
          title: "Anliegen",
          description:
            "Laden Sie eine Liste hoch, in der die Auswahl der möglichen Anliegen definiert ist.",
          sections: [
            fileSection({
              name: "concerns",
              label: "Upload (yaml-Datei)",
              downloadFile: downloadConcerns,
              accept: FileType.Yaml,
            }),
          ],
        },
        fieldSheet({
          title: "Dauer der Zugangsmöglichkeit",
          description:
            "Legen Sie die die Dauer fest, in der Bürger:innen Zugang zum Vorgang haben, nachdem dieser geschlossen wurde.",
          type: "number",
          name: "keycloakUserCleanupJobOverdueDuration",
          label: "Dauer in Tagen",
          required: "Bitte Dauer eingeben.",
          min: 0,
        }),
        fieldSheet({
          title: "Zeitpunkt für Frist-Warnhinweise",
          description:
            "Legen Sie fest, wie viele Tage vor Ablauf der Frist ein Vorgang als “dringend” markiert wird.",
          type: "number",
          name: "medicalOpinionCutOffDateLeadTime",
          label: "Anzahl der Tage bis Fristende",
          required: "Bitte Dauer eingeben.",
          min: 0,
        }),
        fieldSheet({
          title: "Anamnese anzeigen im Online Portal",
          label: "Soll der Anamnesebogen im Online Portal angezeigt werden?",
          name: "citizenPortalAnamnesisEnabled",
          type: "radio",
          direction: "row",
          options: [
            { value: "true", label: "Ja" },
            { value: "false", label: "Nein" },
          ],
          required: "Bitte eine Option auswählen.",
        }),
        {
          title: "Startseite im Online Portal",
          sections: [
            markdownFileSection({
              title: "Deutsch",
              name: "landingContentDe",
              downloadFile: () => downloadLandingPage(ApiLanguage.German),
            }),
            markdownFileSection({
              title: "Englisch",
              name: "landingContentEn",
              required: false,
              downloadFile: () => downloadLandingPage(ApiLanguage.English),
            }),
          ],
        },
        {
          title: "Anliegen auswählen Infobox im Online Portal",
          description:
            "Falls kein Text konfiguriert ist wird keine Infobox angezeigt.",
          sections: [
            markdownFileSection({
              title: "Deutsch",
              name: "selectConcernInfoboxDe",
              required: false,
              downloadFile: () =>
                downloadSelectConcernInfobox(ApiLanguage.German),
            }),
            markdownFileSection({
              title: "Englisch",
              name: "selectConcernInfoboxEn",
              required: false,
              downloadFile: () =>
                downloadSelectConcernInfobox(ApiLanguage.English),
            }),
          ],
        },
      ] satisfies FormSheet[],
    [downloadConcerns, downloadLandingPage, downloadSelectConcernInfobox],
  );
}

function fieldSheet({
  title,
  description,
  ...props
}: Pick<FormSheet, "title" | "description"> & FormFields): FormSheet {
  return {
    title,
    description,
    sections: [
      {
        content: {
          type: "field",
          rows: [
            {
              fields: [props],
            },
          ],
        },
      },
    ],
  };
}

function fileSection({
  title,
  description,
  required = true,
  ...props
}: Pick<FormSection, "title" | "description"> & {
  required?: boolean;
  label: string;
  name: string;
  accept?: FileType | FileType[];
  downloadFile: () => Promise<void> | void;
}): FormSection {
  return {
    title,
    description,
    content: {
      type: "field",
      rows: [
        {
          fields: [
            {
              ...props,
              type: "upload",
              required: required ? "Bitte ausfüllen" : undefined,
              width: { width: "100%", maxWidth: "500px" },
            },
          ],
        },
      ],
    },
  };
}

function markdownFileSection(
  props: Pick<FormSection, "title"> & {
    required?: boolean;
    name: string;
    downloadFile: () => Promise<void> | void;
  },
) {
  return fileSection({
    ...props,
    label: "Upload (Markdown-Datei)",
    accept: FileType.Md,
  });
}

function mapDocument(
  file: ApiDocumentDetails,
  type: ApiFileType | CustomFileType,
): FileUploadValue {
  return {
    name: file.fileName,
    size: file.fileSizeBytes,
    type,
  };
}

function mapOptionalDocument(
  file: ApiDocumentDetails | undefined,
  type: ApiFileType | CustomFileType,
) {
  if (file === undefined) {
    return null;
  }
  return mapDocument(file, type);
}

function booleanToString(value: boolean | string) {
  if (typeof value === "string") {
    return "";
  }
  return value ? "true" : "false";
}

function mapFileToRequest(value: ConfigFile): Blob | undefined {
  if (value instanceof File) {
    return value;
  }
  // the user selected no file, we send "undefined" to the backend
  //  which tells it either no change was made or the file was deleted
  return undefined;
}
