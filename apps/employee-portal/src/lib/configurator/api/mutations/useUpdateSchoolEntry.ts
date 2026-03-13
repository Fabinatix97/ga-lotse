/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  mapRequiredValue,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  type ApiAddSchoolEntryMeasurementDeviceRequest,
  ApiUpdateSchoolEntryConfigRequest,
  type ApiUpdateSchoolEntryMeasurementDeviceRequest,
} from "@eshg/school-entry-api";

import { SchoolEntryFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/SchoolEntry";
import {
  useConfiguratorSchoolEntryApi,
  useSchoolEntryDeviceRegistryConfigApi,
} from "@/lib/shared/api/clients";

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

export function useUpdateHearingTestMeasuring() {
  const snackbar = useSnackbar();
  const measuringDeviceApi = useSchoolEntryDeviceRegistryConfigApi();
  return useHandledMutation({
    mutationFn: ({ enabled }: { enabled: boolean }) =>
      measuringDeviceApi.updateHearingTestMeasuringToggle(enabled),
    onSuccess: () =>
      snackbar.confirmation(
        "Die Hörtest Messgerät-Nutzung wurde erfolgreich bearbeitet.",
      ),
  });
}

export function useUpdateSeeingTestMeasuring() {
  const snackbar = useSnackbar();
  const measuringDeviceApi = useSchoolEntryDeviceRegistryConfigApi();
  return useHandledMutation({
    mutationFn: ({ enabled }: { enabled: boolean }) =>
      measuringDeviceApi.updateSeeingTestMeasuringToggle(enabled),
    onSuccess: () =>
      snackbar.confirmation(
        "Die Sehtest Messgerät-Nutzung wurde erfolgreich bearbeitet.",
      ),
  });
}

export function useCreateMeasuringDevice() {
  const measuringDeviceApi = useSchoolEntryDeviceRegistryConfigApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (params: ApiAddSchoolEntryMeasurementDeviceRequest) =>
      measuringDeviceApi.addDevice(params),
    onSuccess: () => {
      snackbar.confirmation("Das Messgerät wurde erfolgreich hinzugefügt.");
    },
  });
}

export function useUpdateMeasuringDevice() {
  const snackbar = useSnackbar();
  const measuringDeviceApi = useSchoolEntryDeviceRegistryConfigApi();
  return useHandledMutation({
    mutationFn: ({
      deviceId,
      request,
    }: {
      deviceId: string;
      request: ApiUpdateSchoolEntryMeasurementDeviceRequest;
    }) => measuringDeviceApi.updateDevice(deviceId, request),
    onSuccess: () => snackbar.confirmation("Das Messgerät wurde bearbeitet."),
  });
}

export function useDeleteMeasuringDevice() {
  const snackbar = useSnackbar();
  const measuringDeviceApi = useSchoolEntryDeviceRegistryConfigApi();
  const { mutateAsync } = useHandledMutation({
    mutationFn: (deviceId: string) => measuringDeviceApi.deleteDevice(deviceId),
    onSuccess: () =>
      snackbar.confirmation("Das Messgerät wurde erfolgreich gelöscht."),
  });
  return mutateAsync;
}
