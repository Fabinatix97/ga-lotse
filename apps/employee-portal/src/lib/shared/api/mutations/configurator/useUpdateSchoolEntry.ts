/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  mapRequiredValue,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
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
    invitationIncludePerson: model.invitationIncludePerson,
    invitationIncludeRoom: model.invitationIncludeRoom,
  };
}
