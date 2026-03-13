/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInspSetAssigneeRequest,
  ApiUpdateSamplingPointRequest,
} from "@eshg/inspection-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import {
  useFacilityApi,
  useSamplingPointApi,
} from "@/lib/businessModules/inspection/api/clients";

export function useUpdateSamplingPoint() {
  const samplingPointApi = useSamplingPointApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async (updatePointOfSamplingRequest: {
      samplingPointId: string;
      request: ApiUpdateSamplingPointRequest;
    }) => {
      await samplingPointApi.updateSamplingPoint(
        updatePointOfSamplingRequest.samplingPointId,
        updatePointOfSamplingRequest.request,
      );
    },
    onSuccess: () => {
      snackbar.confirmation("Erfolgreich gespeichert!");
    },
  });
}

export function useAssignUserToFacility() {
  const facilityApi = useFacilityApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async (request: {
      assignUserRequest: ApiInspSetAssigneeRequest;
      facilityExternalId: string;
    }) => {
      await facilityApi.setAssignee(
        request.facilityExternalId,
        request.assignUserRequest,
      );
    },
    onSuccess: () => {
      snackbar.confirmation("Benutzer erfolgreich gespeichert!");
    },
  });
}

export function useCreateSamplingPoints() {
  const samplingPointApi = useSamplingPointApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async (request: ApiUpdateSamplingPointRequest) => {
      await samplingPointApi.createSamplingPoint(request);
    },
    onSuccess: () => {
      snackbar.confirmation("Erfolgreich gespeichert!");
    },
  });
}
