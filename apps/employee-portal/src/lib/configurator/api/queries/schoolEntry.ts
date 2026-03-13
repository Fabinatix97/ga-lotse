/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DefaultError,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  type ApiGetSchoolEntryDeviceRegistryConfigResponse,
  ApiGetSchoolEntryLibConfigResponse,
  SchoolEntryDeviceRegistryConfigApi,
} from "@eshg/school-entry-api";

import { schoolEntryApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import { SchoolEntryFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/SchoolEntry";
import {
  useConfiguratorSchoolEntryApi,
  useSchoolEntryDeviceRegistryConfigApi,
} from "@/lib/shared/api/clients";

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

export function useGetSchoolEntryDeviceRegistryConfig() {
  const schoolEntryDeviceApi = useSchoolEntryDeviceRegistryConfigApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      "getSchoolEntryDeviceRegistryConfig",
      schoolEntryDeviceApi,
    ]),
    queryFn: () => schoolEntryDeviceApi.getSchoolEntryDeviceRegistryConfig(),
    select: (data: ApiGetSchoolEntryDeviceRegistryConfigResponse) => ({
      hearingTestDeviceMeasuring:
        data._configuration.hearingTestDeviceMeasuring,
      seeingTestDeviceMeasuring: data._configuration.seeingTestDeviceMeasuring,
      measuringDevices: data._configuration.measuringDevices,
    }),
  });
}

export function validateEquipmentSelectorIsUniqueQuery(
  schoolEntryApi: SchoolEntryDeviceRegistryConfigApi,
  equipmentSelector: string,
) {
  return queryOptions<boolean, DefaultError>({
    queryKey: schoolEntryApiQueryKey([
      "validateEquipmentSelectorIsUnique",
      equipmentSelector,
    ]),
    queryFn: () =>
      schoolEntryApi.validateEquipmentSelectorIsUnique(equipmentSelector),
  });
}

export function validateNameIsUniqueQuery(
  schoolEntryApi: SchoolEntryDeviceRegistryConfigApi,
  name: string,
) {
  return queryOptions<boolean, DefaultError>({
    queryKey: schoolEntryApiQueryKey(["validateNameIsUnique", name]),
    queryFn: () => schoolEntryApi.validateNameIsUnique(name),
  });
}
