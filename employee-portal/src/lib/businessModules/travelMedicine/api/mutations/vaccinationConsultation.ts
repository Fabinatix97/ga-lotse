/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  AbortDraftVaccinationConsultationRequest,
  AcceptDraftVaccinationConsultationRequest,
  AddProcedureStepRequest,
  ApiPatchVaccinationConsultationPatientRequest,
  ApiPatchVaccinationConsultationTravelDetailsRequest,
  ApiPostPutCertificateRequest,
  ApiPostVaccinationConsultationRequest,
  ApiProcedureStatus,
  ApiSyncPersonRequest,
  AssignStepToServiceRequest,
  PatchOtherServiceRequest,
  PatchVaccinationRequest,
  PostInformationStatementsRequest,
  PostServicesRequest,
} from "@eshg/travel-medicine-api";

import { useVaccinationConsultationApi } from "@/lib/businessModules/travelMedicine/api/clients";

export function useSaveVaccinationConsultation() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: ApiPostVaccinationConsultationRequest) =>
      vaccinationConsultationApi.postVaccinationConsultation(request),
    onSuccess: () => {
      snackbar.confirmation("Der Vorgang wurde angelegt.");
    },
  });
}

export function useUpdateVaccination() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: PatchVaccinationRequest) =>
      vaccinationConsultationApi
        .patchVaccinationRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Die Impfung wurde durchgeführt.");
    },
  });
}

export function useAddProcedureStep() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: AddProcedureStepRequest) =>
      vaccinationConsultationApi
        .addProcedureStepRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Der Impftermin wurde erstellt.");
    },
  });
}

export function useUpdateOtherService() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: PatchOtherServiceRequest) =>
      vaccinationConsultationApi
        .patchOtherServiceRaw(request)
        .then(unwrapRawResponse),

    onSuccess: () => {
      snackbar.confirmation("Die Leistung wurde durchgeführt.");
    },
  });
}

interface UseUpdatePatientRequest {
  procedureId: string;
  apiRequest: ApiPatchVaccinationConsultationPatientRequest;
}
export function useUpdatePatient() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: UseUpdatePatientRequest) =>
      vaccinationConsultationApi
        .updatePatient(request.procedureId, request.apiRequest)
        .then(() =>
          snackbar.confirmation("Die Patientendaten wurden gespeichert."),
        )
        .catch(() =>
          snackbar.error(
            "Die Patientendaten konnten nicht gespeichert werden.",
          ),
        ),
  });
}

interface UseUpdateTravelDetailsRequest {
  id: string;
  apiRequest: ApiPatchVaccinationConsultationTravelDetailsRequest;
}
export function useUpdateTravelDetails() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: UseUpdateTravelDetailsRequest) =>
      vaccinationConsultationApi.updateTravelDetails(
        request.id,
        request.apiRequest,
      ),
    onSuccess: () => {
      snackbar.confirmation("Die Reisedaten wurden gespeichert.");
    },
  });
}

export function usePostServices() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: PostServicesRequest) =>
      vaccinationConsultationApi
        .postServicesRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => snackbar.confirmation("Die Services wurden hinzugefügt."),
  });
}

interface UseDeleteServiceRequest {
  procedureId: string;
  serviceId: string;
}
export function useDeleteService() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: UseDeleteServiceRequest) =>
      vaccinationConsultationApi.deleteService(
        request.procedureId,
        request.serviceId,
      ),
    onSuccess: () => snackbar.confirmation("Der Service wurde entfernt."),
  });
}

export function useAssignStepToService() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: AssignStepToServiceRequest) =>
      vaccinationConsultationApi
        .assignStepToServiceRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () =>
      snackbar.confirmation("Die Leistung wurde zu dem Termin hinzugefügt."),
  });
}

interface UseUnassignStepToServiceRequest {
  procedureId: string;
  serviceId: string;
}
export function useUnassignStepToService() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useMutation({
    mutationFn: (request: UseUnassignStepToServiceRequest) =>
      vaccinationConsultationApi.unassignStepToService(
        request.procedureId,
        request.serviceId,
      ),
    onSuccess: () =>
      snackbar.confirmation("Die Leistung wurde aus dem Termin entfernt."),
    onError: () =>
      snackbar.error(
        "Die Leistung konnte nicht aus dem Termin entfernt werden.",
      ),
  });
}

export interface UsePostCertificateRequest {
  procedureId: string;
  apiPostPutCertificateRequest: ApiPostPutCertificateRequest;
}
export function usePostCertificate() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useMutation({
    mutationFn: (request: UsePostCertificateRequest) =>
      vaccinationConsultationApi.postCertificate(
        request.procedureId,
        request.apiPostPutCertificateRequest,
      ),
    onSuccess: () => snackbar.confirmation("Die Bescheinigung wurde erzeugt."),
    onError: () =>
      snackbar.error("Die Bescheinigung konnte nicht erzeugt werden."),
  });
}

export interface UsePatchStatusRequest {
  procedureId: string;
  apiProcedureStatus: ApiProcedureStatus;
}
export function usePatchStatus() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useMutation({
    mutationFn: (request: UsePatchStatusRequest) =>
      vaccinationConsultationApi.patchStatus(
        request.procedureId,
        request.apiProcedureStatus,
      ),
    onSuccess: () =>
      snackbar.confirmation("Der Vorgangsstatus wurde geändert."),
    onError: () =>
      snackbar.error("Der Vorgangsstatus konnte nicht geändert werden."),
  });
}

export function useCreateInformationStatements() {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: PostInformationStatementsRequest) =>
      vaccinationConsultationApi
        .postInformationStatementsRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Die Aufklärungsbögen wurden angelegt.");
    },
  });
}

interface UseResetInformationStatementRequest {
  procedureId: string;
  informationStatementId: string;
}

export function useResetInformationStatement() {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UseResetInformationStatementRequest) =>
      vaccinationConsultationApi.resetInformationStatement(
        request.procedureId,
        request.informationStatementId,
      ),
    onSuccess: () => {
      snackbar.confirmation("Der Aufklärungsbogen wurde zurückgesetzt.");
    },
  });
}

interface UseDeleteInformationStatementRequest {
  procedureId: string;
  informationStatementId: string;
}
export function useDeleteInformationStatement() {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UseDeleteInformationStatementRequest) =>
      vaccinationConsultationApi.deleteInformationStatement(
        request.procedureId,
        request.informationStatementId,
      ),
    onSuccess: () => {
      snackbar.confirmation("Der Aufklärungsbogen wurde gelöscht.");
    },
  });
}

export function useSyncPerson(procedureId: string) {
  const procedureApi = useVaccinationConsultationApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiSyncPersonRequest) =>
      procedureApi.syncPersonData(procedureId, request),
    onSuccess: () => snackbar.confirmation("Die Änderungen wurden übernommen."),
  });
}

export function useAboardDraftVaccinationConsultation() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: AbortDraftVaccinationConsultationRequest) =>
      vaccinationConsultationApi.abortDraftVaccinationConsultationRaw(request),
    onSuccess: () => {
      snackbar.confirmation("Der Vorgang wurde abgebrochen.");
    },
  });
}

export function useAcceptDraftVaccinationConsultation() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: AcceptDraftVaccinationConsultationRequest) =>
      vaccinationConsultationApi.acceptDraftVaccinationConsultationRaw(request),
    onSuccess: () => {
      snackbar.confirmation("Der Vorgang wurde gestartet.");
    },
  });
}
