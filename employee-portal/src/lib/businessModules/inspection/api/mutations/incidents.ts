/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CreateIncidentRequest,
  DeleteIncidentRequest,
  UpdateIncidentRequest,
} from "@eshg/employee-portal-api/inspection";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useIncidentApi } from "@/lib/businessModules/inspection/api/clients";
import { isServiceWorkerResponse } from "@/serviceWorker/common/common";

export function useCreateIncident() {
  const incidentApi = useIncidentApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (req: CreateIncidentRequest) => {
      const rawResponse = await incidentApi.createIncidentRaw(req);
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
        snackbar.confirmation("Vorkommnis gespeichert");
      }
    },
  });
}

export function useUpdateIncident() {
  const incidentApi = useIncidentApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (req: UpdateIncidentRequest) => {
      const rawResponse = await incidentApi.updateIncidentRaw(req);
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
        snackbar.confirmation("Vorkommnis gespeichert");
      }
    },
  });
}

export function useDeleteIncident() {
  const incidentApi = useIncidentApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (req: DeleteIncidentRequest) => {
      const rawResponse = await incidentApi.deleteIncidentRaw(req);
      return {
        serviceWorkerResponse: isServiceWorkerResponse(rawResponse),
      };
    },
    onSuccess: (data) => {
      if (data.serviceWorkerResponse) {
        snackbar.notification("Löschen zwischengespeichert");
      } else {
        snackbar.confirmation("Vorkommnis gelöscht");
      }
    },
  });
}
