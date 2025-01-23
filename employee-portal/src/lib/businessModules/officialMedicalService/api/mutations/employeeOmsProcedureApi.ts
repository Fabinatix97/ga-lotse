/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AbortDraftProcedureRequest,
  AcceptDraftProcedureRequest,
  ApiConcern,
  ApiPatchEmployeeOmsProcedureFacilityRequest,
  ApiPatchEmployeeOmsProcedurePhysicianRequest,
  ApiPostEmployeeOmsProcedureRequest,
  ApiPostOmsAppointmentRequest,
  ApiSyncAffectedPersonRequest,
  ApiSyncFacilityRequest,
  CloseOpenProcedureRequest,
  UpdateAffectedPersonRequest,
} from "@eshg/employee-portal-api/officialMedicalService";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

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

export function useUpdateOmsProcedureConcern() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: ({ id, concern }: { id: string; concern: ApiConcern }) => {
      return employeeOmsProcedureApi.updateOmsProcedureConcern(id, {
        concern: concern,
      });
    },
    onSuccess: () => {
      snackbar.confirmation("Das Anliegen wurde gesetzt.");
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

export function usePatchPhysician(procedureId: string) {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useEmployeeOmsProcedureApi();

  return useHandledMutation({
    mutationFn: (request: ApiPatchEmployeeOmsProcedurePhysicianRequest) => {
      return employeeOmsProcedureApi.patchPhysician(procedureId, request);
    },
    onSuccess: () => {
      snackbar.confirmation("Die Ärzt:in wurde bearbeitet.");
    },
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
