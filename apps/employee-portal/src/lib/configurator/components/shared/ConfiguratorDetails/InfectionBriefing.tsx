/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { notFound } from "next/navigation";
import { useMemo } from "react";

import { FileType } from "@eshg/lib-portal";

import { useUpdateInfectionBriefing } from "@/lib/configurator/api/mutations/useUpdateInfectionBriefing";
import {
  useDownloadInfectionBriefingLandingPage,
  useGetInfectionBriefingConfig,
} from "@/lib/configurator/api/queries/infectionBriefing";
import {
  ConfiguratorForm,
  FormSection,
  FormSheet,
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
  supportedLanguages,
} from "@/lib/i18n/language";

export interface InfectionBriefingFormModel {
  landingContent: Record<SupportedLanguage, ConfigFile>;
}

const endpointName: ConfiguratorEndpointName = "INFECTION_BRIEFING";

export function InfectionBriefing(props: { module: ConfiguratorModuleName }) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <InfectionBriefingConfiguratorForm module={props.module} />;
}

function InfectionBriefingConfiguratorForm(props: {
  module: ConfiguratorModuleName;
}) {
  const { data } = useGetInfectionBriefingConfig();
  const { mutateAsync: updateInfectionBriefing } = useUpdateInfectionBriefing();
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });
  const sheets = useInfectionBriefingSheets();

  async function handleSubmit(model: InfectionBriefingFormModel) {
    await updateInfectionBriefing(model);
  }

  return (
    <ConfiguratorForm
      sheets={sheets}
      initialValues={data}
      status={currentTabStatus}
      onSubmit={handleSubmit}
    />
  );
}

function useInfectionBriefingSheets() {
  const { download: downloadLandingPage } =
    useDownloadInfectionBriefingLandingPage();

  return useMemo(
    () =>
      [
        {
          title: "Startseite im Online Portal",
          sections: supportedLanguages.map((lang) =>
            markdownFileSection({
              title: languageLabel[lang],
              name: "landingContent." + lang,
              required: lang === "de",
              downloadFile: () => downloadLandingPage(lang),
            }),
          ),
        },
      ] satisfies FormSheet[],
    [downloadLandingPage],
  );
}

function markdownFileSection(
  props: Pick<FormSection, "title"> & {
    required?: boolean;
    name: string;
    downloadFile: () => Promise<void> | void;
  },
): FormSection {
  return {
    title: props.title,
    content: {
      type: "field",
      rows: [
        {
          fields: [
            {
              ...props,
              label: "Upload (Markdown-Datei)",
              accept: FileType.Md,
              type: "upload",
              required: props.required ? "Bitte ausfüllen" : undefined,
              width: { width: "100%", maxWidth: "500px" },
            },
          ],
        },
      ],
    },
  };
}
