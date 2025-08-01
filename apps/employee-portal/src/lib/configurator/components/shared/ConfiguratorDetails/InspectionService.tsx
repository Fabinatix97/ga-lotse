/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { notFound } from "next/navigation";
import { useMemo } from "react";

import { ApiFacilityFileNumberMethod } from "@eshg/inspection-api";

import {
  ConfiguratorForm,
  FormSheet,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { isEndpointSupportedByModule } from "@/lib/configurator/shared/config";
import {
  ConfiguratorEndpointName,
  ConfiguratorModuleName,
} from "@/lib/configurator/shared/types";
import { useUpdateInspectionConfig } from "@/lib/shared/api/mutations/configurator/useUpdateInspection";
import { useGetInspectionConfig } from "@/lib/shared/api/queries/configurator/inspection";

export interface InspectionServiceFormModel {
  facilityFileNumberMethod: ApiFacilityFileNumberMethod;
}

const endpointName: ConfiguratorEndpointName = "INSPECTION";

export function InspectionService(props: { module: ConfiguratorModuleName }) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <InspectionConfiguratorForm module={props.module} />;
}

function InspectionConfiguratorForm(props: { module: ConfiguratorModuleName }) {
  const { data } = useGetInspectionConfig();
  const { mutateAsync: updateInspectionConfig } = useUpdateInspectionConfig();
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });
  const sheets = useInspectionSheets();

  async function handleSubmit({
    facilityFileNumberMethod,
  }: InspectionServiceFormModel) {
    await updateInspectionConfig({
      facilityFileNumberMethod: facilityFileNumberMethod,
    });
  }
  return (
    <ConfiguratorForm
      sheets={sheets}
      initialValues={{
        facilityFileNumberMethod: data.facilityFileNumberMethod,
      }}
      status={currentTabStatus}
      onSubmit={handleSubmit}
    />
  );
}

function useInspectionSheets(): FormSheet[] {
  return useMemo(
    () => [
      {
        title: "Fachliche Einstellungen",
        sections: [
          {
            title: "Methode der Aktenzeichenerzeugung",
            description:
              "Wählen Sie eine der verfügbaren Methoden aus, welche die Erzeugung von Aktenzeichen aus Adressdaten steuern.",
            content: {
              type: "field",
              rows: [
                {
                  fields: [
                    {
                      type: "radio",
                      label: "Methode",
                      name: "facilityFileNumberMethod",
                      required: "Bitte auswählen",
                      direction: "column",
                      options: [
                        {
                          value: ApiFacilityFileNumberMethod.NoFileNumbers,
                          label: "[Keine]",
                        },
                        {
                          value:
                            ApiFacilityFileNumberMethod.InspectionFrankfurt,
                          label: "Frankfurter Methode",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
    [],
  );
}
