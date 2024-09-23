/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddCustodianRequest,
  ApiCreateAppointmentsBulkRequest,
  ApiCreateMedicalReportRequest,
  ApiCreateProcedureRequest,
  ApiCreateSchoolInfoLetterRequest,
  ApiImportStatistics,
  ApiRemoveCustodianRequest,
  ApiResponse,
  ApiSyncPersonRequest,
  ApiUpdatePersonRequest,
  CloseProcedureRequest,
  DeleteProcedureRequest,
  ImportCitizenListRequest,
  ImportSchoolListRequest,
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
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { ImportDataValues } from "@/lib/businessModules/schoolEntry/features/procedures/importData/ImportDataSidebar";

interface ImportDataResult {
  file: File;
  statistics: ApiImportStatistics;
}

export function useImportData(requireSchoolYear: boolean) {
  const schoolEntryApi = useSchoolEntryApi();
  return useHandledMutation({
    mutationFn: (values: ImportDataValues) =>
      values.listType === "schoolList"
        ? schoolEntryApi
            .importSchoolListRaw(mapSchoolFormValues(values, requireSchoolYear))
            .then(parseImportResult)
        : schoolEntryApi
            .importCitizenListRaw(
              mapCitizenFormValues(values, requireSchoolYear),
            )
            .then(parseImportResult),
  });
}

function mapCitizenFormValues(
  values: ImportDataValues,
  requireSchoolYear: boolean,
): ImportCitizenListRequest {
  return {
    file: mapRequiredValue(values.file),
    schoolYear: requireSchoolYear
      ? mapRequiredValue(values.schoolYear)
      : new Date().getFullYear(),
  };
}

function mapSchoolFormValues(
  values: ImportDataValues,
  requireSchoolYear: boolean,
): ImportSchoolListRequest {
  return {
    ...mapCitizenFormValues(values, requireSchoolYear),
    schoolId: mapRequiredValue(values.schoolId),
    locationId: mapOptionalValue(values.locationId),
  };
}

/**
 * We parse the response manually, because it was not possible to strictly type the multipart-part content
 */
async function parseImportResult(
  response: ApiResponse<object>,
): Promise<ImportDataResult> {
  const formData = await response.raw.formData();
  const file = formData.get("file");
  const statisticsJson = formData.get("statistics");

  if (!(file instanceof File && typeof statisticsJson === "string")) {
    throw new Error("Response contains invalid import result.");
  }

  const statistics = JSON.parse(statisticsJson) as ApiImportStatistics;
  return {
    file,
    statistics,
  };
}

export function useCreateAppointmentsInBulk() {
  const schoolEntryApi = useSchoolEntryApi();

  return useHandledMutation({
    mutationFn: (values: ApiCreateAppointmentsBulkRequest) =>
      schoolEntryApi.createAppointmentsInBulk(values),
  });
}

export function useUpdateProcedure() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (values: UpdateProcedureRequest) =>
      schoolEntryApi.updateProcedureRaw(values).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Die Zusatzinfos wurden erfolgreich geändert.");
    },
  });
}

export function useUpdateHearingTestResult() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UpdateHearingTestResultRequest) =>
      schoolEntryApi
        .updateHearingTestResultRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation(
        "Die Ergebnisse des Hörscreenings wurden erfolgreich gespeichert.",
      );
    },
  });
}

export function useUpdateEyeExaminationResult() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UpdateEyeExaminationResultRequest) =>
      schoolEntryApi
        .updateEyeExaminationResultRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation(
        "Die Ergebnisse des Sehscreenings wurden erfolgreich gespeichert.",
      );
    },
  });
}

export function useUpdateSopessExaminationResult() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UpdateSopessExaminationResultRequest) =>
      schoolEntryApi
        .updateSopessExaminationResultRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Der SOPESS Test wurde erfolgreich gespeichert.");
    },
  });
}

export function useUpdateDevelopmentScreeningResult() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UpdateDevelopmentScreeningResultRequest) =>
      schoolEntryApi
        .updateDevelopmentScreeningResultRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Der S1 Befund wurde erfolgreich gespeichert.");
    },
  });
}

export function useUpdateVaccinationStatus() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UpdateVaccinationStatusRequest) =>
      schoolEntryApi
        .updateVaccinationStatusRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Der Impfstatus wurde erfolgreich gespeichert.");
    },
  });
}

export function useUpdateAnamnesis() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UpdateAnamnesisRequest) =>
      schoolEntryApi.updateAnamnesisRaw(request).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Die Anamnese wurde erfolgreich gespeichert.");
    },
  });
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

export function useUpdateChild() {
  const schoolEntryApi = useSchoolEntryApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: UpdateChildDataRequest) =>
      schoolEntryApi.updateChildDataRaw(request).then(unwrapRawResponse),
    onSuccess: () =>
      snackbar.confirmation(
        "Die Änderungen zum Kind wurden erfolgreich gespeichert.",
      ),
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
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiAddCustodianRequest) =>
      schoolEntryApi.addCustodian(procedureId, request),
    onSuccess: () => snackbar.confirmation("PSB erfolgreich angelegt."),
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
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiRemoveCustodianRequest) =>
      schoolEntryApi
        .removeCustodianRaw({
          procedureId,
          custodianCentralFileStateId,
          apiRemoveCustodianRequest: request,
        })
        .then(unwrapRawResponse),
    onSuccess: () => snackbar.confirmation("PSB erfolgreich entfernt."),
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
