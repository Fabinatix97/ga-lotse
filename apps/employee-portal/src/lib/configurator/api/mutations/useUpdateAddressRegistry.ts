/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AddressDirectoryConfigApi } from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { buildFilePayload } from "@/lib/configurator/api/mutations/buildFilePayload";
import { AddressRegistryFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/AddressRegistry";
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
    streetDirectory: await buildFilePayload(
      params.streetDirectory,
      () => api.getStreetDirectoryFile(),
      "document.csv",
      "text/csv",
    ),
    municipalityDirectory: await buildFilePayload(
      params.municipalityDirectory,
      () => api.getMunicipalityDirectoryFile(),
      "document.csv",
      "text/csv",
    ),
  };
}
