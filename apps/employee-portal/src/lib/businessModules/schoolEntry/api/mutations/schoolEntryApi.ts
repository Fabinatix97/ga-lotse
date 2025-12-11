/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationOptions, useQueryClient } from "@tanstack/react-query";

import {
  unwrapRawResponse,
  useFileDownload,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  ApiAddCustodianRequest,
  type ApiAddCustodianWithoutDateOfBirthRequest,
  ApiAnamnesis,
  ApiCloseProcedureRequest,
  ApiCreateAppointmentsBulkRequest,
  ApiCreateMedicalReportRequest,
  ApiCreateProcedureRequest,
  ApiDevelopmentScreeningResult,
  ApiEyeExaminationResult,
  ApiHearingTestResult,
  ApiRemoveCustodianRequest,
  ApiReopenProcedureRequest,
  ApiSaveSchoolInfoLetterRequest,
  ApiSopessExaminationResult,
  ApiSyncPersonRequest,
  ApiUpdatePersonRequest,
  ApiUpdateProceduresInvitationSentRequest,
  ApiUpdateProceduresWithLabelsRequest,
  ApiVaccinationStatus,
  ApiWaitingRoom,
  DeleteProcedureRequest,
  UpdateAnamnesisRequest,
  UpdateChildDataRequest,
  UpdateDevelopmentScreeningResultRequest,
  UpdateEyeExaminationResultRequest,
  UpdateHearingTestResultRequest,
  UpdateProcedureRequest,
  UpdateSopessExaminationResultRequest,
  UpdateVaccinationStatusRequest,
} from "@eshg/school-entry-api";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import {
  SchoolInfoLetter as SchoolInfoLetterType,
  mapSchoolInfoLetterToApiRequest,
} from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";
import {
  getAnamnesisQuery,
  getProcedureQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";

export function useCreateAppointmentsInBulk() {
  const schoolEntryApi = useSchoolEntryApi();

  return useHandledMutation({
    mutationFn: (values: ApiCreateAppointmentsBulkRequest) =>
      schoolEntryApi.createAppointmentsInBulk(values),
  });
}

export function useUpdateProcedureLabelsInBulk() {
  const schoolEntryApi = useSchoolEntryApi();

  return useHandledMutation({
    mutationFn: (values: ApiUpdateProceduresWithLabelsRequest) =>
      schoolEntryApi.updateProceduresWithLabels(values),
  });
}

export function useUpdateProcedureInvitationIsSentInBulk() {
  const schoolEntryApi = useSchoolEntryApi();

  return useHandledMutation({
    mutationFn: (values: ApiUpdateProceduresInvitationSentRequest) =>
      schoolEntryApi.updateProceduresInvitationSent(values),
  });
}

export function useUpdateProcedure(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  const { queryKey } = getProcedureQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (values: UpdateProcedureRequest) =>
      schoolEntryApi.updateProcedureRaw(values).then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Die Zusatzinfos wurden erfolgreich geändert.");
    },
  });
}

export function useUpdateHearingTestResultOptions(): MutationOptions<
  ApiHearingTestResult,
  Error,
  UpdateHearingTestResultRequest
> {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return {
    mutationFn: (request: UpdateHearingTestResultRequest) =>
      schoolEntryApi
        .updateHearingTestResultRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation(
        "Die Ergebnisse des Hörscreenings wurden erfolgreich gespeichert.",
      );
    },
  };
}

export function useUpdateEyeExaminationResultOptions(): MutationOptions<
  ApiEyeExaminationResult,
  Error,
  UpdateEyeExaminationResultRequest
> {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return {
    mutationFn: (request: UpdateEyeExaminationResultRequest) =>
      schoolEntryApi
        .updateEyeExaminationResultRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation(
        "Die Ergebnisse des Sehscreenings wurden erfolgreich gespeichert.",
      );
    },
  };
}

export function useUpdateSopessExaminationResultOptions(): MutationOptions<
  ApiSopessExaminationResult,
  Error,
  UpdateSopessExaminationResultRequest
> {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return {
    mutationFn: (request: UpdateSopessExaminationResultRequest) =>
      schoolEntryApi
        .updateSopessExaminationResultRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Der SOPESS Test wurde erfolgreich gespeichert.");
    },
  };
}

export function useUpdateDevelopmentScreeningResultOptions(): MutationOptions<
  ApiDevelopmentScreeningResult,
  Error,
  UpdateDevelopmentScreeningResultRequest
> {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return {
    mutationFn: (request: UpdateDevelopmentScreeningResultRequest) =>
      schoolEntryApi
        .updateDevelopmentScreeningResultRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Der S1 Befund wurde erfolgreich gespeichert.");
    },
  };
}

export function useUpdateVaccinationStatusOptions(): MutationOptions<
  ApiVaccinationStatus,
  Error,
  UpdateVaccinationStatusRequest
> {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return {
    mutationFn: (request: UpdateVaccinationStatusRequest) =>
      schoolEntryApi
        .updateVaccinationStatusRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Der Impfstatus wurde erfolgreich gespeichert.");
    },
  };
}

export function useUpdateAnamnesisOptions(
  procedureId: string,
): MutationOptions<ApiAnamnesis, Error, UpdateAnamnesisRequest> {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  const { queryKey } = getAnamnesisQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();
  return {
    meta: { updatesQuery: queryKey },
    mutationFn: (request: UpdateAnamnesisRequest) =>
      schoolEntryApi.updateAnamnesisRaw(request).then(unwrapRawResponse),
    onSuccess: (updatedApiAnamnesis) => {
      queryClient.setQueryData(queryKey, updatedApiAnamnesis);
      snackbar.confirmation("Die Anamnese wurde erfolgreich gespeichert.");
    },
  };
}

export function useCreateProcedure() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiCreateProcedureRequest) =>
      schoolEntryApi.createProcedure(request),
    onSuccess: () => {
      snackbar.confirmation("Vorgang erfolgreich angelegt.");
    },
  });
}

export function useUpdateChild(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  const { queryKey } = getProcedureQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (request: UpdateChildDataRequest) =>
      schoolEntryApi.updateChildDataRaw(request).then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation(
        "Die Änderungen zum Kind wurden erfolgreich gespeichert.",
      );
    },
  });
}

export function useSyncPerson(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiSyncPersonRequest) =>
      schoolEntryApi.syncPersonData(procedureId, request),
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden erfolgreich übernommen."),
  });
}

export function useAddPersonAsCustodian(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  const { queryKey } = getProcedureQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  return useHandledMutation({
    meta: {
      updatesQuery: queryKey,
    },
    mutationFn: (request: ApiAddCustodianRequest) =>
      schoolEntryApi.addCustodian(procedureId, request),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("PSB erfolgreich angelegt.");
    },
  });
}

export function useAddPersonWithoutDateOfBirthAsCustodian(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  const { queryKey } = getProcedureQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  return useHandledMutation({
    meta: {
      updatesQuery: queryKey,
    },
    mutationFn: (request: ApiAddCustodianWithoutDateOfBirthRequest) =>
      schoolEntryApi.addCustodianWithoutDateOfBirth(procedureId, request),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("PSB erfolgreich angelegt.");
    },
  });
}

export function useUpdateCustodian(
  procedureId: string,
  custodianCentralFileStateId: string,
) {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  const { queryKey } = getProcedureQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();

  return useHandledMutation({
    meta: {
      updatesQuery: queryKey,
    },
    mutationFn: (request: ApiUpdatePersonRequest) =>
      schoolEntryApi.updateCustodian(
        procedureId,
        custodianCentralFileStateId,
        request,
      ),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation(
        "Die Änderungen zum PSB wurden erfolgreich gespeichert.",
      );
    },
  });
}

export function useUpdateCustodianWithoutDateOfBirth(
  procedureId: string,
  custodianCentralFileStateId: string,
) {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  const { queryKey } = getProcedureQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();

  return useHandledMutation({
    meta: {
      updatesQuery: queryKey,
    },
    mutationFn: (request: ApiUpdatePersonRequest) =>
      schoolEntryApi.updateCustodianWithoutDateOfBirth(
        procedureId,
        custodianCentralFileStateId,
        request,
      ),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation(
        "Die Änderungen zum PSB wurden erfolgreich gespeichert.",
      );
    },
  });
}

export function useRemoveCustodian(
  procedureId: string,
  custodianCentralFileStateId: string,
) {
  const schoolEntryApi = useSchoolEntryApi();
  const { queryKey } = getProcedureQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (request: ApiRemoveCustodianRequest) =>
      schoolEntryApi
        .removeCustodianRaw({
          procedureId,
          custodianCentralFileStateId,
          apiRemoveCustodianRequest: request,
        })
        .then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("PSB erfolgreich entfernt.");
    },
  });
}

export function useRemoveCustodianWithoutDateOfBirth(
  procedureId: string,
  custodianId: string,
) {
  const schoolEntryApi = useSchoolEntryApi();
  const { queryKey } = getProcedureQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (request: ApiRemoveCustodianRequest) =>
      schoolEntryApi
        .removeCustodianWithoutDateOfBirthRaw({
          procedureId,
          custodianId,
          apiRemoveCustodianRequest: request,
        })
        .then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("PSB erfolgreich entfernt.");
    },
  });
}

export function useCloseProcedure(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  const { queryKey } = getProcedureQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (apiCloseProcedureRequest: ApiCloseProcedureRequest) =>
      schoolEntryApi
        .closeProcedureRaw({
          procedureId: procedureId,
          apiCloseProcedureRequest,
        })
        .then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Vorgang erfolgreich geschlossen.");
    },
  });
}

export function useReopenProcedure(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  const { queryKey } = getProcedureQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (apiReopenProcedureRequest: ApiReopenProcedureRequest) =>
      schoolEntryApi
        .reopenProcedureRaw({
          procedureId,
          apiReopenProcedureRequest,
        })
        .then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Vorgang erfolgreich wiedereröffnet.");
    },
  });
}

export function useDeleteProcedure() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (values: DeleteProcedureRequest) =>
      schoolEntryApi.deleteProcedureRaw(values).then(unwrapRawResponse),
    onSuccess: () => snackbar.confirmation("Vorgang erfolgreich gelöscht."),
  });
}

export function useCreateMedicalReport(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  return useHandledMutation({
    mutationFn: (request: ApiCreateMedicalReportRequest) =>
      schoolEntryApi.createMedicalReportRaw({
        procedureId,
        apiCreateMedicalReportRequest: request,
      }),
  });
}

export function useSaveSchoolInfoLetter(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();

  const saveSchoolInfoLetter = useHandledMutation({
    mutationFn: (request: ApiSaveSchoolInfoLetterRequest) =>
      schoolEntryApi.saveSchoolInfoLetter(procedureId, request),
    onSuccess: () => {
      snackbar.confirmation("Änderungen erfolgreich gespeichert");
    },
  });
  return (values: SchoolInfoLetterType) =>
    saveSchoolInfoLetter.mutateAsync(mapSchoolInfoLetterToApiRequest(values));
}

export function useGenerateSchoolInfoLetterPdf(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  const generateSchoolInfoLetterPdf = useHandledMutation({
    mutationFn: () =>
      schoolEntryApi.generateSchoolInfoLetterPdfRaw({ procedureId }),
  });
  return useFileDownload(generateSchoolInfoLetterPdf.mutateAsync);
}

export function useUpdateWaitingRoomDetails(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  const { queryKey } = getProcedureQuery(schoolEntryApi, procedureId);
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  return useHandledMutation({
    meta: { updatesQuery: queryKey },
    mutationFn: (apiWaitingRoom: ApiWaitingRoom) =>
      schoolEntryApi
        .updateWaitingRoomDetailsRaw({ procedureId, apiWaitingRoom })
        .then(unwrapRawResponse),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, (procedureResponse) => {
        if (procedureResponse === undefined) {
          return undefined;
        }

        return { ...procedureResponse, waitingRoom: response };
      });
      snackbar.confirmation("Wartezimmmer Informationen erfolgreich geändert.");
    },
  });
}
