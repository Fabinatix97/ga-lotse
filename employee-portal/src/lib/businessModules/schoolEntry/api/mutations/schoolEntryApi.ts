/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddCustodianRequest,
  ApiAnamnesis,
  ApiCreateAppointmentsBulkRequest,
  ApiCreateMedicalReportRequest,
  ApiCreateProcedureRequest,
  ApiCreateSchoolInfoLetterRequest,
  ApiDevelopmentScreeningResult,
  ApiEyeExaminationResult,
  ApiHearingTestResult,
  ApiRemoveCustodianRequest,
  ApiSopessExaminationResult,
  ApiSyncPersonRequest,
  ApiUpdatePersonRequest,
  ApiVaccinationStatus,
  CloseProcedureRequest,
  DeleteProcedureRequest,
  ReopenProcedureRequest,
  UpdateAnamnesisRequest,
  UpdateChildDataRequest,
  UpdateDevelopmentScreeningResultRequest,
  UpdateEyeExaminationResultRequest,
  UpdateHearingTestResultRequest,
  UpdateProcedureRequest,
  UpdateSopessExaminationResultRequest,
  UpdateVaccinationStatusRequest,
  UpdateWaitingRoomDetailsRequest,
} from "@eshg/employee-portal-api/schoolEntry";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { MutationOptions, useQueryClient } from "@tanstack/react-query";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
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

export function useUpdateCustodian(
  procedureId: string,
  custodianCentralFileStateId: string,
) {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiUpdatePersonRequest) =>
      schoolEntryApi.updateCustodianRaw({
        procedureId,
        custodianCentralFileStateId,
        apiUpdatePersonRequest: request,
      }),
    onSuccess: () =>
      snackbar.confirmation(
        "Die Änderungen zum PSB wurden erfolgreich gespeichert.",
      ),
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

export function useCloseProcedure() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (values: CloseProcedureRequest) =>
      schoolEntryApi.closeProcedureRaw(values).then(unwrapRawResponse),
    onSuccess: () => snackbar.confirmation("Vorgang erfolgreich geschlossen."),
  });
}

export function useReopenProcedure() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (values: ReopenProcedureRequest) =>
      schoolEntryApi.reopenProcedureRaw(values).then(unwrapRawResponse),
    onSuccess: () =>
      snackbar.confirmation("Vorgang erfolgreich wiedereröffnet."),
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

export function useCreateSchoolInfoLetter(procedureId: string) {
  const schoolEntryApi = useSchoolEntryApi();
  return useHandledMutation({
    mutationFn: (request: ApiCreateSchoolInfoLetterRequest) =>
      schoolEntryApi.createSchoolInfoLetterRaw({
        procedureId,
        apiCreateSchoolInfoLetterRequest: request,
      }),
  });
}

export function useUpdateWaitingRoomDetails() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UpdateWaitingRoomDetailsRequest) =>
      schoolEntryApi
        .updateWaitingRoomDetailsRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () =>
      snackbar.confirmation("Wartezimmmer Informationen erfolgreich geändert."),
  });
}
