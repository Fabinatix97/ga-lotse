/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors } from "formik";
import { notFound } from "next/navigation";
import { useCallback, useMemo } from "react";

import { FileType } from "@eshg/lib-portal";

import { useUpdateOms } from "@/lib/configurator/api/mutations/useUpdateOms";
import {
  useDownloadOmsConcerns,
  useDownloadOmsLandingPage,
  useDownloadOmsSelectConcernInfobox,
  useGetOmsConfig,
} from "@/lib/configurator/api/queries/officialMedicalService";
import {
  ConfiguratorForm,
  FormSection,
  FormSheet,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
import {
  ConfigFile,
  FormFields,
} from "@/lib/configurator/components/shared/RenderField";
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

export interface OfficialMedicalServiceFormModel {
  keycloakUserCleanupJobOverdueDuration: number | string;
  medicalOpinionCutOffDateLeadTime: number | string;
  citizenPortalAnamnesisEnabled: "true" | "false" | "";
  concerns: ConfigFile;
  landingContent: Record<SupportedLanguage, ConfigFile>;
  selectConcernInfobox: Record<SupportedLanguage, ConfigFile>;
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
  const initialValues = useGetOmsConfig();
  const updateOms = useUpdateOms();
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });
  const sheets = useOmsSheets();
  const validate = useValidateSelectConcernInfobox();

  return (
    <ConfiguratorForm
      sheets={sheets}
      initialValues={initialValues}
      status={currentTabStatus}
      validate={validate}
      onSubmit={async (model) => await updateOms(model)}
    />
  );
}

function useValidateSelectConcernInfobox() {
  return useCallback(
    ({ selectConcernInfobox }: OfficialMedicalServiceFormModel) => {
      const errors: FormikErrors<OfficialMedicalServiceFormModel> = {};
      if (
        selectConcernInfobox.de === null &&
        supportedLanguages.some(
          (lang) => lang !== "de" && selectConcernInfobox[lang] !== null,
        )
      ) {
        errors.selectConcernInfobox ??= {};
        errors.selectConcernInfobox.de =
          "Die deutsche Übersetzung ist erforderlich wenn eine andere Übersetzung vorhanden ist.";
      }
      return errors;
    },
    [],
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
          sections: supportedLanguages.map((lang) =>
            markdownFileSection({
              title: languageLabel[lang],
              name: `landingContent.${lang}`,
              required: lang === "de",
              downloadFile: () => downloadLandingPage(mapToApiLanguage(lang)),
            }),
          ),
        },
        {
          title: "Anliegen auswählen Infobox im Online Portal",
          description:
            "Falls kein Text konfiguriert ist wird keine Infobox angezeigt.",
          sections: supportedLanguages.map((lang) =>
            markdownFileSection({
              title: languageLabel[lang],
              name: `selectConcernInfobox.${lang}`,
              required: lang === "de",
              downloadFile: () =>
                downloadSelectConcernInfobox(mapToApiLanguage(lang)),
            }),
          ),
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
