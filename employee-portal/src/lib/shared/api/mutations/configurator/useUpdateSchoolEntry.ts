/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { ApiUpdateSchoolEntryConfigRequest } from "@eshg/school-entry-api";

import { SchoolEntryFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/SchoolEntry";
import { useConfiguratorSchoolEntryApi } from "@/lib/shared/api/clients";

export function useUpdateSchoolEntry() {
  const snackbar = useSnackbar();
  const configuratorApi = useConfiguratorSchoolEntryApi();

  const { mutateAsync } = useHandledMutation({
    mutationFn: (params: SchoolEntryFormModel) =>
      configuratorApi.updateSchoolEntryConfig(mapToApi(params)),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return mutateAsync;
}

function mapToApi(
  model: SchoolEntryFormModel,
): ApiUpdateSchoolEntryConfigRequest {
  return {
    locationSelectionMode: mapRequiredValue(model.locationSelectionMode),
    directProcedureTypeAssignmentOnImport:
      model.directProcedureTypeAssignmentOnImport,
    pdfDocumentAccentColor: model.pdfDocumentAccentColor,
  };
}
