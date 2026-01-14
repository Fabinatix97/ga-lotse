/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { ApiGetSchoolEntryLibConfigResponse } from "@eshg/school-entry-api";

import { SchoolEntryFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/SchoolEntry";
import { useConfiguratorSchoolEntryApi } from "@/lib/shared/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

export function useGetSchoolEntryConfig() {
  const schoolEntryApi = useConfiguratorSchoolEntryApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey(["getSchoolEntryConfig", schoolEntryApi]),
    queryFn: () => schoolEntryApi.getSchoolEntryConfig(),
    select: (data: ApiGetSchoolEntryLibConfigResponse) => ({
      values: {
        locationSelectionMode: data._configuration?.locationSelectionMode ?? "",
        directProcedureTypeAssignmentOnImport:
          data._configuration?.directProcedureTypeAssignmentOnImport ?? false,
        pdfDocumentAccentColor:
          data._configuration?.pdfDocumentAccentColor ?? "",
        invitationIncludePerson:
          data._configuration?.invitationIncludePerson ?? false,
        invitationIncludeRoom:
          data._configuration?.invitationIncludeRoom ?? false,
      } satisfies SchoolEntryFormModel,

      locationSelectionModeReadOnly:
        data._configuration?.locationSelectionModeReadOnly ?? false,
    }),
  });
}
