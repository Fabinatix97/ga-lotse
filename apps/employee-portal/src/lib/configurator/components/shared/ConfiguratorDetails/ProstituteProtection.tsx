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
import { useUpdateProstituteProtection } from "@/lib/shared/api/mutations/configurator/useUpdateProstituteProtection";
import {
  useDownloadProstituteProtectionLandingPage,
  useGetProstituteProtectionConfig,
} from "@/lib/shared/api/queries/configurator/prostituteProtection";

export interface ProstituteProtectionFormModel {
  landingContentDe: ConfigFile;
  landingContentEn: ConfigFile;
  onlinePortalBookingEnabled: boolean;
}

const endpointName: ConfiguratorEndpointName = "PROSTITUTE_PROTECTION";

export function ProstituteProtection(props: {
  module: ConfiguratorModuleName;
}) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <ProstituteProtectionConfiguratorForm module={props.module} />;
}

function ProstituteProtectionConfiguratorForm(props: {
  module: ConfiguratorModuleName;
}) {
  const { data } = useGetProstituteProtectionConfig();
  const { mutateAsync: updateProstituteProtection } =
    useUpdateProstituteProtection();
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });
  const sheets = useProstituteProtectionSheets();

  async function handleSubmit({
    landingContentDe,
    landingContentEn,
    onlinePortalBookingEnabled,
  }: ProstituteProtectionFormModel) {
    await updateProstituteProtection({
      landingContentDe,
      landingContentEn,
      onlinePortalBookingEnabled,
    });
  }

  return (
    <ConfiguratorForm
      sheets={sheets}
      initialValues={{
        landingContentDe: data.landingContentDe,
        landingContentEn: data.landingContentEn,
        onlinePortalBookingEnabled: data.onlinePortalBookingEnabled,
      }}
      status={currentTabStatus}
      onSubmit={handleSubmit}
    />
  );
}

function useProstituteProtectionSheets() {
  const { download: downloadLandingPage } =
    useDownloadProstituteProtectionLandingPage();

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
        {
          title: "Termine im Online Portal buchbar",
          description: "Sollen Termine im Online Portal gebucht werden können?",
          sections: [
            {
              content: {
                type: "field",
                rows: [
                  {
                    fields: [
                      {
                        name: "onlinePortalBookingEnabled",
                        type: "checkbox",
                        label: "Terminbuchung verfügbar",
                      },
                    ],
                  },
                ],
              },
            },
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
