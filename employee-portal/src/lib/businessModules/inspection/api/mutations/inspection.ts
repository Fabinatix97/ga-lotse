/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApproveInspectionRequest,
  FinalizeInspectionRequest,
  StartInspectionRequest,
  UpdateInspectionRequest,
} from "@eshg/employee-portal-api/inspection";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import {
  useInspectionApi,
  useInspectionTestDataApi,
} from "@/lib/businessModules/inspection/api/clients";

export function useStartInspection() {
  const inspectionApi = useInspectionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: StartInspectionRequest) =>
      inspectionApi.startInspectionRaw(req).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Vorgang erfolgreich angelegt.");
    },
  });
}

export function useUpdateInspection() {
  const inspectionApi = useInspectionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: UpdateInspectionRequest) =>
      inspectionApi.updateInspectionRaw(req).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Änderung gespeichert.");
    },
  });
}

export function useFinalizeInspection() {
  const inspectionApi = useInspectionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: FinalizeInspectionRequest) =>
      inspectionApi.finalizeInspectionRaw(req).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Begehung abgeschlossen.");
    },
  });
}

export function useApproveInspection() {
  const inspectionApi = useInspectionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: ApproveInspectionRequest) =>
      inspectionApi.approveInspectionRaw(req).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Begehung freigegeben.");
    },
  });
}

export function useCreateTestData() {
  const inspectionTestDataApi = useInspectionTestDataApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: () => inspectionTestDataApi.createTestData(),
    onSuccess: () => {
      snackbar.confirmation("Testdaten erstellt.");
    },
  });
}
