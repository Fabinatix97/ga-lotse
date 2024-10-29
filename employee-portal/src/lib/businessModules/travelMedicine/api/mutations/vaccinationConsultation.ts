/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AddProcedureStepRequest,
  ApiPatchVaccinationConsultationPatientRequest,
  ApiPatchVaccinationConsultationTravelDetailsRequest,
  ApiPostPutCertificateRequest,
  ApiPostVaccinationConsultationRequest,
  ApiProcedureStatus,
  AssignStepToServiceRequest,
  PatchOtherServiceRequest,
  PatchVaccinationRequest,
  PostInformationStatementsRequest,
  PostServicesRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { ApiSyncPersonRequest } from "@eshg/employee-portal-api/travelMedicine/models";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useVaccinationConsultationApi } from "@/lib/businessModules/travelMedicine/api/clients";

export function useSaveVaccinationConsultation() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: ApiPostVaccinationConsultationRequest) =>
      vaccinationConsultationApi.postVaccinationConsultation(request),
    onSuccess: () => {
      snackbar.confirmation("Vorgang erfolgreich angelegt.");
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
      snackbar.confirmation("Impfung wurde erfolgreich durchgeführt");
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
      snackbar.confirmation("Impftermin wurde erstellt");
    },
  });
}

export interface UseUpdateVaccinationTravelDetailsRequest {
  externalId: string;
  apiRequest: ApiPatchVaccinationConsultationTravelDetailsRequest;
}
export function useUpdateVaccinationConsultationTravelDetails() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: UseUpdateVaccinationTravelDetailsRequest) =>
      vaccinationConsultationApi.updateTravelDetails(
        request.externalId,
        request.apiRequest,
      ),
    onSuccess: () => {
      snackbar.confirmation("Reisedaten erfolgreich bearbeitet");
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
      snackbar.confirmation("Leistung wurde erfolgreich durchgeführt");
    },
  });
}

export interface UseUpdatePatientRequest {
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
        .then(() => snackbar.confirmation("Patient erfolgreich bearbeitet."))
        .catch(() => snackbar.error("Patient konnte nicht bearbeitet werden.")),
  });
}

export interface UseUpdateTravelDetailsRequest {
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
      snackbar.confirmation("Reisedaten erfolgreich bearbeitet");
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
    onSuccess: () => snackbar.confirmation("Services wurden hinzugefügt"),
  });
}

export interface UseDeleteServiceRequest {
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
    onSuccess: () => snackbar.confirmation("Service wurde entfernt"),
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
      snackbar.confirmation("Leistung erfolgreich zu Termin hinzugefügt"),
  });
}

export interface UseUnassignStepToServiceRequest {
  procedureId: string;
  serviceId: string;
}
export function useUnassignStepToService() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: UseUnassignStepToServiceRequest) =>
      vaccinationConsultationApi.unassignStepToService(
        request.procedureId,
        request.serviceId,
      ),
    onSuccess: () =>
      snackbar.confirmation("Leistung erfolgreich aus Termin entfernt"),
    onError: () =>
      snackbar.error("Leistung konnte nicht aus Termin entfernt werden"),
  });
}

export interface UsePostCertificateRequest {
  procedureId: string;
  apiPostPutCertificateRequest: ApiPostPutCertificateRequest;
}
export function usePostCertificate() {
  const snackbar = useSnackbar();
  const vaccinationConsultationApi = useVaccinationConsultationApi();

  return useHandledMutation({
    mutationFn: (request: UsePostCertificateRequest) =>
      vaccinationConsultationApi.postCertificate(
        request.procedureId,
        request.apiPostPutCertificateRequest,
      ),
    onSuccess: () => snackbar.confirmation("Bescheinigung erzeugt"),
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

  return useHandledMutation({
    mutationFn: (request: UsePatchStatusRequest) =>
      vaccinationConsultationApi.patchStatus(
        request.procedureId,
        request.apiProcedureStatus,
      ),
    onSuccess: () => snackbar.confirmation("Vorgangsstatus geändert"),
    onError: () =>
      snackbar.error("Der Vorgangsstatus konnte nicht verändert werden"),
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

export interface UseDeleteInformationStatementRequest {
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
