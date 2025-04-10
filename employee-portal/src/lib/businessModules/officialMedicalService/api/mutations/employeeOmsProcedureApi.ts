/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  AbortDraftProcedureRequest,
  AcceptDraftProcedureRequest,
  ApiPatchEmployeeOmsProcedureFacilityRequest,
  ApiPostEmployeeOmsProcedureRequest,
  ApiPostOmsAppointmentRequest,
  ApiSyncAffectedPersonRequest,
  ApiSyncFacilityRequest,
  CloseOpenProcedureRequest,
  MergeAffectedPersonRequest,
  PatchMedicalOpinionStatusRequest,
  PatchWaitingRoomRequest,
  PostDocumentRequest,
  UpdateAdditionalInfoRequest,
  UpdateAffectedPersonRequest,
} from "@eshg/official-medical-service-api";

import { useEmployeeOmsProcedureApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { mapFacilityFormValuesToApiAddFacilityFileStateRequest } from "@/lib/shared/helpers/facilityUtils";

export function usePostEmployeeProcedure() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: ApiPostEmployeeOmsProcedureRequest) =>
      employeeOmsProcedureApi.postEmployeeProcedure(request),
    onSuccess: () => {
      snackbar.confirmation("Der Vorgang wurde angelegt.");
    },
  });
}

export function usePatchAffectedPerson() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: UpdateAffectedPersonRequest) =>
      employeeOmsProcedureApi.updateAffectedPersonRaw(request),
    onSuccess: () => {
      snackbar.confirmation("Die betroffene Person wurde bearbeitet.");
    },
  });
}

export function useSyncAffectedPerson(procedureId: string) {
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: ApiSyncAffectedPersonRequest) =>
      employeeOmsProcedureApi.syncAffectedPerson(procedureId, request),
    onSuccess: () => snackbar.confirmation("Die Änderungen wurden übernommen."),
  });
}

export function usePostFacility() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: ({
      id,
      facility,
    }: {
      id: string;
      facility: DefaultFacilityFormValues;
    }) => {
      const baseFacility =
        mapFacilityFormValuesToApiAddFacilityFileStateRequest(facility);
      return employeeOmsProcedureApi.postFacility(id, {
        facility: { ...baseFacility, version: 0 },
      });
    },
    onSuccess: () => {
      snackbar.confirmation("Der Auftraggeber wurde hinzugefügt.");
    },
  });
}

export function usePatchFacility() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: ApiPatchEmployeeOmsProcedureFacilityRequest;
    }) => {
      return employeeOmsProcedureApi.patchFacility(id, request);
    },
    onSuccess: () => {
      snackbar.confirmation("Der Auftraggeber wurde bearbeitet.");
    },
  });
}

export function usePatchAdditionalInfo() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: UpdateAdditionalInfoRequest) => {
      return employeeOmsProcedureApi.updateAdditionalInfoRaw(request);
    },
    onSuccess: () => {
      snackbar.confirmation("Die Zusatzinfos wurden gespeichert.");
    },
  });
}

export function useSyncFacility(procedureId: string) {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: ApiSyncFacilityRequest) =>
      employeeOmsProcedureApi.syncFacilityData(procedureId, request),
    onSuccess: () => snackbar.confirmation("Die Änderungen wurden übernommen."),
  });
}

export function useAbortDraftProcedure() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: AbortDraftProcedureRequest) =>
      employeeOmsProcedureApi.abortDraftProcedureRaw(request),
    onSuccess: () => snackbar.confirmation("Der Vorgang wurde verworfen."),
  });
}

export function useAcceptDraftProcedure() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: AcceptDraftProcedureRequest) =>
      employeeOmsProcedureApi.acceptDraftProcedureRaw(request),
    onSuccess: () => snackbar.confirmation("Der Vorgang wurde angelegt."),
  });
}

export function useCloseOpenProcedure() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: CloseOpenProcedureRequest) =>
      employeeOmsProcedureApi.closeOpenProcedureRaw(request),
    onSuccess: () => snackbar.confirmation("Der Vorgang wurde geschlossen."),
  });
}

export function usePostAppointment() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: ({
      procedureId,
      request,
    }: {
      procedureId: string;
      request: ApiPostOmsAppointmentRequest;
    }) => employeeOmsProcedureApi.postAppointment(procedureId, request),
    onSuccess: () => snackbar.confirmation("Der Termin wurde angelegt."),
  });
}

export function usePostDocument() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: PostDocumentRequest) =>
      employeeOmsProcedureApi.postDocumentRaw(request),
    onSuccess: () => snackbar.confirmation("Das Dokument wurde angelegt."),
  });
}

export function usePatchMedicalOpinionStatus() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: PatchMedicalOpinionStatusRequest) => {
      return employeeOmsProcedureApi.patchMedicalOpinionStatusRaw(request);
    },
    onSuccess: () => {
      snackbar.confirmation("Gutachtenstatus geändert");
    },
  });
}

export function usePatchWaitingRoom() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: PatchWaitingRoomRequest) =>
      employeeOmsProcedureApi.patchWaitingRoomRaw(request),
    onSuccess: () =>
      snackbar.confirmation("Das Wartezimmer wurde aktualisiert."),
  });
}

export function useMergeAffectedPerson() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: MergeAffectedPersonRequest) =>
      employeeOmsProcedureApi.mergeAffectedPersonRaw(request),
    onSuccess: () => snackbar.confirmation("Personendaten geprüft"),
  });
}
