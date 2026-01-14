/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AddressDirectoryConfigApi } from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { AddressRegistryFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/AddressRegistry";
import { ConfigFile } from "@/lib/configurator/components/shared/RenderField";
import { useAddressRegistryConfigurationApi } from "@/lib/shared/api/clients";

export function useUpdateAddressRegistry() {
  const snackbar = useSnackbar();
  const addressRegistryApi = useAddressRegistryConfigurationApi();

  const mutation = useHandledMutation({
    mutationFn: (params: AddressRegistryFormModel) => {
      return updateAddressRegistry(addressRegistryApi, params);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (model: AddressRegistryFormModel) => {
    return mutation.mutateAsync(model);
  };
}

async function updateAddressRegistry(
  api: AddressDirectoryConfigApi,
  params: AddressRegistryFormModel,
) {
  return api.updateAddressRegistryConfigRaw(await buildPayload(api, params));
}

async function buildPayload(
  api: AddressDirectoryConfigApi,
  params: AddressRegistryFormModel,
) {
  return {
    streetDirectory: await buildFilePayload(params.streetDirectory, () =>
      api.getStreetDirectoryFile(),
    ),
    municipalityDirectory: await buildFilePayload(
      params.municipalityDirectory,
      () => api.getMunicipalityDirectoryFile(),
    ),
  };
}

async function buildFilePayload(
  value: ConfigFile,
  downloadFn: () => Promise<Blob>,
) {
  return value instanceof File
    ? new File([value], value.name, { type: "text/csv" })
    : new File([await downloadFn()], "document.csv", {
        type: "text/csv",
      });
}
