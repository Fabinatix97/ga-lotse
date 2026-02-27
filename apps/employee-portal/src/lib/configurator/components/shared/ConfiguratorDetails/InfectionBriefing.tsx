/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { notFound } from "next/navigation";
import { useMemo } from "react";

import { ApiLanguage } from "@eshg/base-api";
import { FileType } from "@eshg/lib-portal";

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
import { useUpdateInfectionBriefing } from "@/lib/shared/api/mutations/configurator/useUpdateInfectionBriefing";
import {
  useDownloadInfectionBriefingLandingPage,
  useGetInfectionBriefingConfig,
} from "@/lib/shared/api/queries/configurator/infectionBriefing";

export interface InfectionBriefingFormModel {
  landingContentDe: ConfigFile;
  landingContentEn: ConfigFile;
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

  async function handleSubmit({
    landingContentDe,
    landingContentEn,
  }: InfectionBriefingFormModel) {
    await updateInfectionBriefing({
      landingContentDe,
      landingContentEn,
    });
  }

  return (
    <ConfiguratorForm
      sheets={sheets}
      initialValues={{
        landingContentDe: data.landingContentDe,
        landingContentEn: data.landingContentEn,
      }}
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
          sections: [
            markdownFileSection({
              title: "Deutsch",
              name: "landingContentDe",
              required: true,
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
