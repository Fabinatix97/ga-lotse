/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UseMutationResult } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  ApiCloseProcedureRequest,
  ApiInspection,
  ApproveInspectionRequest,
  FinalizeInspectionRequest,
  ResolveFacilityDuplicateRequest,
  ResolveInspectionDuplicateRequest,
  StartInspectionRequest,
  UpdateInspectionRequest,
} from "@eshg/inspection-api";
import {
  unwrapRawResponse,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";

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

export function useLockInspection() {
  const { mutateAsync: updateInspection } = useUpdateInspection();
  return useCallback(
    async (procedureId: string, lockInspection: boolean) => {
      await updateInspection({
        id: procedureId,
        apiUpdateInspectionRequest: { lock: lockInspection },
      });
    },
    [updateInspection],
  );
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

export function useResolveFacilityDuplicate() {
  const inspectionApi = useInspectionApi();
  return useHandledMutation({
    mutationFn: (req: ResolveFacilityDuplicateRequest) =>
      inspectionApi.resolveFacilityDuplicateRaw(req).then(unwrapRawResponse),
  });
}

export function useResolveInspectionDuplicate() {
  const inspectionApi = useInspectionApi();
  return useHandledMutation({
    mutationFn: (req: ResolveInspectionDuplicateRequest) =>
      inspectionApi.resolveInspectionDuplicateRaw(req).then(unwrapRawResponse),
  });
}

export function useSyncFacility() {
  const inspectionApi = useInspectionApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: ({
      procedureId,
      facilityVersion,
    }: {
      procedureId: string;
      facilityVersion: number;
    }) =>
      inspectionApi
        .syncInspectionFacilityFileStateRaw({
          id: procedureId,
          apiInspectionSyncFileStateRequest: {
            facilityVersion,
          },
        })
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Einrichtung erfolgreich synchronisiert.");
    },
  });
}

export function useCloseProcedure(
  id: string,
): UseMutationResult<ApiInspection, Error, ApiCloseProcedureRequest, unknown> {
  const inspectionApi = useInspectionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: ApiCloseProcedureRequest) =>
      inspectionApi.closeProcedure(id, req),
    onSuccess: () => {
      snackbar.confirmation("Vorgang erfolgreich geschlossen.");
    },
  });
}
