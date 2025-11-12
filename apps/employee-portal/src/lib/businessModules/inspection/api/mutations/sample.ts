/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CreateSampleRequest,
  DeleteSampleRequest,
  UpdateSampleMeasurementParameterValueRequest,
  UpdateSampleRequest,
} from "@eshg/inspection-api";
import {
  unwrapRawResponse,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";

import { useSampleApi } from "@/lib/businessModules/inspection/api/clients";
import { isServiceWorkerResponse } from "@/serviceWorker/common/common";

export function useCreateSample() {
  const sampleApi = useSampleApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (req: CreateSampleRequest) => {
      const rawResponse = await sampleApi.createSampleRaw(req);
      const response = await unwrapRawResponse(rawResponse);
      return {
        ...response,
        serviceWorkerResponse: isServiceWorkerResponse(rawResponse),
      };
    },
    onSuccess: (data) => {
      if (data.serviceWorkerResponse) {
        snackbar.notification("Zwischengespeichert");
      } else {
        snackbar.confirmation("Probe hinzugefügt");
      }
    },
  });
}

export function useUpdateSample() {
  const sampleApi = useSampleApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (req: UpdateSampleRequest) => {
      const rawResponse = await sampleApi.updateSampleRaw(req);
      const response = await unwrapRawResponse(rawResponse);
      return {
        ...response,
        serviceWorkerResponse: isServiceWorkerResponse(rawResponse),
      };
    },
    onSuccess: (data) => {
      if (data.serviceWorkerResponse) {
        snackbar.notification("Zwischengespeichert");
      } else {
        snackbar.confirmation("Probe gespeichert");
      }
    },
  });
}

export function useDeleteSample() {
  const sampleApi = useSampleApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (req: DeleteSampleRequest) => {
      const rawResponse = await sampleApi.deleteSampleRaw(req);
      return {
        serviceWorkerResponse: isServiceWorkerResponse(rawResponse),
      };
    },
    onSuccess: (data) => {
      if (data.serviceWorkerResponse) {
        snackbar.notification("Löschen zwischengespeichert");
      } else {
        snackbar.confirmation("Probe gelöscht");
      }
    },
  });
}

export function useUpdateSampleMeasurementParameterValue() {
  const sampleApi = useSampleApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (req: UpdateSampleMeasurementParameterValueRequest) => {
      const rawResponse =
        await sampleApi.updateSampleMeasurementParameterValueRaw(req);
      const response = await unwrapRawResponse(rawResponse);
      return {
        ...response,
        serviceWorkerResponse: isServiceWorkerResponse(rawResponse),
      };
    },
    onSuccess: (data) => {
      if (data.serviceWorkerResponse) {
        snackbar.notification("Zwischengespeichert");
      } else {
        snackbar.confirmation("Messparameter gespeichert");
      }
    },
  });
}
