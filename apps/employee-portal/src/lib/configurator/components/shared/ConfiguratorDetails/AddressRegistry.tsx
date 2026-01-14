/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileDownloadOutlined } from "@mui/icons-material";
import { FormikValues } from "formik";
import { notFound } from "next/navigation";

import { ButtonLink, FileType, useFileDownload } from "@eshg/lib-portal";

import { ConfiguratorForm } from "@/lib/configurator/components/shared/ConfiguratorForm";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { isEndpointSupportedByModule } from "@/lib/configurator/shared/config";
import {
  ConfiguratorEndpointName,
  ConfiguratorModuleName,
} from "@/lib/configurator/shared/types";
import { useAddressRegistryConfigurationApi } from "@/lib/shared/api/clients";
import { useUpdateAddressRegistry } from "@/lib/shared/api/mutations/configurator/useUpdateAddressRegistry";
import { useAddressRegistryConfig } from "@/lib/shared/api/queries/configurator/addressRegistry";

enum FormNames {
  STREET_DIRECTORY = "streetDirectory",
  MUNICIPALITY_DIRECTORY = "municipalityDirectory",
}

export interface AddressRegistryFormModel extends FormikValues {
  [FormNames.STREET_DIRECTORY]: ConfigFile;
  [FormNames.MUNICIPALITY_DIRECTORY]: ConfigFile;
}

const UPLOAD_FIELD_WIDTH = "500px";

const endpointName: ConfiguratorEndpointName = "ADDRESS_REGISTRY";

export function AddressRegistry(props: { module: ConfiguratorModuleName }) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <AddressRegistryConfiguratorForm module={props.module} />;
}

function AddressRegistryConfiguratorForm(props: {
  module: ConfiguratorModuleName;
}) {
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });

  const result = useAddressRegistryConfig();

  const updateAddressRegistry = useUpdateAddressRegistry();

  async function onSubmit(model: AddressRegistryFormModel) {
    await updateAddressRegistry(model);
  }

  const streetRegistryDownload = useStreetRegistryDownload();
  const municipalityRegistryDownload = useMunicipalityRegistryDownload();

  return (
    <ConfiguratorForm
      sheets={[
        {
          title: "Verzeichnisse",
          sections: [
            {
              title: "Straßenverzeichnis",
              description: (
                <DownloadTemplateLink onClick={streetRegistryDownload} />
              ),
              content: {
                type: "field",
                rows: [
                  {
                    fields: [
                      {
                        type: "upload",
                        name: FormNames.STREET_DIRECTORY,
                        label: "Upload (CSV-Datei)",
                        required: "Upload erforderlich",
                        width: { width: UPLOAD_FIELD_WIDTH },
                        accept: FileType.Csv,
                      },
                    ],
                  },
                ],
              },
            },
            {
              title: "Gemeindeverzeichnis",
              description: (
                <DownloadTemplateLink onClick={municipalityRegistryDownload} />
              ),
              content: {
                type: "field",
                rows: [
                  {
                    fields: [
                      {
                        type: "upload",
                        name: FormNames.MUNICIPALITY_DIRECTORY,
                        label: "Upload (CSV-Datei)",
                        required: "Upload erforderlich",
                        width: { width: UPLOAD_FIELD_WIDTH },
                        accept: FileType.Csv,
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ]}
      initialValues={result.data}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}

function useStreetRegistryDownload() {
  const addressRegistryConfigApi = useAddressRegistryConfigurationApi();
  async function downloadFn() {
    return addressRegistryConfigApi.getStreetDirectoryTemplateRaw();
  }
  return useFileDownload(downloadFn).download;
}

function useMunicipalityRegistryDownload() {
  const addressRegistryConfigApi = useAddressRegistryConfigurationApi();
  async function downloadFn() {
    return addressRegistryConfigApi.getMunicipalityDirectoryTemplateRaw();
  }
  return useFileDownload(downloadFn).download;
}

function DownloadTemplateLink(props: { onClick: () => Promise<void> }) {
  return (
    <ButtonLink
      startDecorator={<FileDownloadOutlined />}
      fontSize="sm"
      onClick={() => props.onClick()}
    >
      Beispiel-Datei herunterladen
    </ButtonLink>
  );
}
