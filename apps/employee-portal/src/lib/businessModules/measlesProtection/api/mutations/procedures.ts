/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useQueryClient } from "@tanstack/react-query";
import { isNullish } from "remeda";

import { mapBaseAddressToApi } from "@eshg/lib-employee-portal";
import {
  MutationPassThrough,
  getFilenameFromHeader,
  mapOptionalValue,
  unwrapRawResponse,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  ApiAccessRestriction,
  ApiAccessRestrictionLetter,
  ApiAddCustodianRequest,
  ApiAddFacilityRequest,
  ApiAddFacilityResponse,
  ApiAffectedPersonDetails,
  ApiCaseStatus,
  ApiCreateAccessRestriction,
  ApiCreateAccessRestrictionLetter,
  ApiCreateMonetaryFine,
  ApiCreatePersonRequest,
  ApiCreateProofRequestLetter,
  ApiCustodianDetails,
  ApiDataOrigin,
  ApiGetProcedure200Response,
  ApiMPFacilityType,
  ApiMonetaryFine,
  ApiOpenProcedureResponse,
  ApiProofSubmission,
  ApiResponse,
  ApiSaveProofRequestLetter,
  ApiSyncAffectedPersonRequest,
  ApiSyncCustodianRequest,
  ApiSyncFacilityRequest,
  ApiUpdateAccessRestriction,
  ApiUpdateProcedureRequest,
  CreateProofSubmissionRequest,
} from "@eshg/measles-protection-api";

import {
  useAccessRestrictionApi,
  useDraftProcedureApi,
  useMonetaryFineApi,
  useProofRequestLetterApi,
  useProofSubmissionApi,
  useProtectionProcedureApi,
} from "@/lib/businessModules/measlesProtection/api/clients";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";
import {
  ValidUpdateProcedureForm,
  mapDefaultFacilityFormValuesToApiPutFacilityRequest,
} from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";

interface UpdateProcedureParams {
  id: string;
  data: ApiUpdateProcedureRequest;
}

export function useUpdateProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<UpdateProcedureParams, ApiGetProcedure200Response>) {
  const measlesProtectionApi = useProtectionProcedureApi();
  return useHandledMutation({
    mutationFn: ({ id, data }: UpdateProcedureParams) => {
      return measlesProtectionApi.updateProcedure(id, data);
    },
    onSuccess,
    onError,
  });
}

interface OpenProcedureParams {
  id: string;
  data: ValidUpdateProcedureForm;
}

export function useSubmitDraftProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<OpenProcedureParams, ApiOpenProcedureResponse>) {
  const measlesProtectionApi = useDraftProcedureApi();
  const client = useQueryClient();
  return useHandledMutation({
    mutationFn: ({ id, data }: OpenProcedureParams) => {
      return measlesProtectionApi.openProcedure(id, {
        reportData: {
          ...data.reportData,
          reportingDate: new Date(data.reportData.reportingDate),
        },
        roleStatus: data.roleStatus,
      });
    },
    async onSuccess(data, variables, onMutateResult, context) {
      await client.invalidateQueries({
        queryKey: measlesProtectionApiQueryKey(["procedures"]),
      });
      return onSuccess?.(data, variables, onMutateResult, context);
    },
    onError,
  });
}

export function useCreateDraftProcedure() {
  const api = useDraftProcedureApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (data: ApiCreatePersonRequest) => api.createPerson(data),
    onSuccess: () => {
      snackbar.confirmation("Vorgang erfolgreich angelegt.");
    },
  });
}

interface AddCustodianParams {
  procedureId: string;
  data: ApiAddCustodianRequest;
}

export function useAddCustodian() {
  const api = useDraftProcedureApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: ({ procedureId, data }: AddCustodianParams) =>
      api.addCustodian(procedureId, data),
    onSuccess: () => {
      snackbar.confirmation("Personensorgeberechtigte:r erfolgreich angelegt.");
    },
  });
}

interface PatchCustodianParams {
  procedureId: string;
  custodianId: string;
  custodian: ApiCustodianDetails;
}

export function useEditCustodian() {
  const api = useProtectionProcedureApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: ({
      procedureId,
      custodianId,
      custodian,
    }: PatchCustodianParams) => {
      return api.editCustodian(procedureId, custodianId, {
        custodianDetails: custodian,
      });
    },
    onSuccess: () => {
      snackbar.confirmation("Änderungen an PSB erfolgreich gespeichert.");
    },
  });
}

interface SyncCustodianParams {
  procedureId: string;
  custodianId: string;
  request: ApiSyncCustodianRequest;
}

export function useSyncCustodian() {
  const api = useProtectionProcedureApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: ({
      procedureId,
      custodianId,
      request,
    }: SyncCustodianParams): Promise<void> => {
      return api.syncCustodian(procedureId, custodianId, request);
    },
    onSuccess: () => {
      snackbar.confirmation("PSB erfolgreich synchronisiert.");
    },
  });
}

interface AddProofSubmissionParams {
  id: string;
  formData: FormData;
  data: CreateProofSubmissionRequest;
}

export function useAddProofMutation({
  onSuccess,
  onError,
}: MutationPassThrough<AddProofSubmissionParams, ApiProofSubmission>) {
  const api = useProofSubmissionApi();
  return useHandledMutation({
    mutationFn: ({ id, formData, data }: AddProofSubmissionParams) => {
      const file = formData.get("file");
      if (!isNullish(file) && file instanceof File) {
        data.file = file;
      } else {
        data.file = undefined;
      }
      return api.createProofSubmission(
        id,
        data.request,
        data.file,
        data.fileMetaData,
      );
    },
    onSuccess,
    onError,
  });
}

async function createFile(response: ApiResponse<string>) {
  const defaultFileName = "Anschreiben_zur_Nachweisvorlage.pdf";
  const fileName = getFilenameFromHeader(response.raw) ?? defaultFileName;
  const binaryFileContent = await response.raw.blob();

  return new File([binaryFileContent], fileName, {
    type: "application/pdf",
  });
}

interface AddProofRequestLetterParams {
  id: string;
  data: ApiCreateProofRequestLetter;
}

export function useCreateProofRequestLetterMutation({
  onSuccess,
  onError,
}: MutationPassThrough<AddProofRequestLetterParams, File>) {
  const api = useProofRequestLetterApi();
  return useHandledMutation({
    mutationFn: async ({ id, data }: AddProofRequestLetterParams) => {
      const response = await api.createProofRequestLetterRaw({
        id: id,
        apiCreateProofRequestLetter: data,
      });
      return createFile(response);
    },
    onSuccess,
    onError,
  });
}

interface SaveProofRequestLetterParams {
  id: string;
  data: ApiSaveProofRequestLetter;
}

export function useSaveProofRequestLetterMutation({
  onSuccess,
  onError,
}: MutationPassThrough<SaveProofRequestLetterParams, void>) {
  const api = useProofRequestLetterApi();
  return useHandledMutation({
    mutationFn: ({ id, data }: AddProofRequestLetterParams) => {
      return api
        .saveProofRequestLetterRaw({
          id: id,
          apiSaveProofRequestLetter: data,
        })
        .then(unwrapRawResponse);
    },
    onSuccess,
    onError,
  });
}

interface AddFineParams {
  id: string;
  data: ApiCreateMonetaryFine;
}

export function useAddFineMutation({
  onSuccess,
  onError,
}: MutationPassThrough<AddFineParams, ApiMonetaryFine>) {
  const api = useMonetaryFineApi();
  return useHandledMutation({
    mutationFn: ({ id, data }: AddFineParams) => {
      return api.createMonetaryFine(id, data);
    },
    onSuccess,
    onError,
  });
}

interface AddAccessRestrictionParams {
  id: string;
  data: ApiCreateAccessRestriction;
}

export function useAddAccessRestrictionMutation({
  onSuccess,
  onError,
}: MutationPassThrough<AddAccessRestrictionParams, ApiAccessRestriction>) {
  const api = useAccessRestrictionApi();
  return useHandledMutation({
    mutationFn: ({ id, data }: AddAccessRestrictionParams) => {
      return api.createAccessRestriction(id, data);
    },
    onSuccess,
    onError,
  });
}

interface AddAccessRestrictionLetterParams {
  id: string;
  data: ApiCreateAccessRestrictionLetter;
  formData: FormData;
}

export function useAddAccessRestrictionLetterMutation({
  onSuccess,
}: MutationPassThrough<
  AddAccessRestrictionLetterParams,
  ApiAccessRestrictionLetter
>) {
  const api = useAccessRestrictionApi();
  return useHandledMutation({
    mutationFn: ({ id, data, formData }: AddAccessRestrictionLetterParams) => {
      const file =
        formData.get("file") !== null
          ? (formData.get("file") as File)
          : undefined;

      return api.createAccessRestrictionLetter(id, data, file);
    },
    onSuccess,
  });
}

interface UpdateAccessRestrictionParams {
  id: string;
  data: ApiUpdateAccessRestriction;
}

export function useUpdateAccessRestrictionMutation({
  onSuccess,
  onError,
}: MutationPassThrough<UpdateAccessRestrictionParams, ApiAccessRestriction>) {
  const api = useAccessRestrictionApi();
  return useHandledMutation({
    mutationFn: ({
      id,
      data: { restrictionTerminationDate },
    }: UpdateAccessRestrictionParams) => {
      return api.updateAccessRestriction(id, {
        restrictionTerminationDate,
      });
    },
    onSuccess,
    onError,
  });
}

// Replace with generated API type from backend
export type MeaslesFacility = DefaultFacilityFormValues &
  Partial<{
    type: ApiMPFacilityType;
    otherFacilityTypeInformation?: string;
  }>;

function mapMeaslesFacilityToApiAddFacilityRequest(
  facility: MeaslesFacility,
): ApiAddFacilityRequest {
  return {
    facility: {
      ...facility,
      contactAddress: mapBaseAddressToApi(facility.contactAddress),
      differentBillingAddress: facility.differentBillingAddress
        ? mapBaseAddressToApi(facility.differentBillingAddress)
        : undefined,
      contactPersons: facility.contactPersons?.map((person) => ({
        ...person,
        firstName: mapOptionalValue(person.firstName),
        emailAddress: mapOptionalValue(person.emailAddress),
        phoneNumber: mapOptionalValue(person.phoneNumber),
        salutation: mapOptionalValue(person.salutation),
        title: mapOptionalValue(person.title),
        role: mapOptionalValue(person.role),
      })),
      dataOrigin: ApiDataOrigin.Manual,
    },
    type: facility.measlesFacilityType?.type as ApiMPFacilityType,
    otherFacilityTypeInformation:
      facility.measlesFacilityType?.otherFacilityTypeInformation,
  };
}

interface AddFacilityParams {
  procedureId: string;
  facility: DefaultFacilityFormValues;
}

export function useAddFacility() {
  const api = useDraftProcedureApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: ({
      procedureId,
      facility,
    }: AddFacilityParams): Promise<ApiAddFacilityResponse> => {
      const request = mapMeaslesFacilityToApiAddFacilityRequest(facility);
      return api.addFacility(procedureId, request);
    },
    onSuccess: () => {
      snackbar.confirmation("Einrichtung erfolgreich gespeichert.");
    },
  });
}

interface PatchFacilityParams {
  procedureId: string;
  facility: DefaultFacilityFormValues;
}

export function useEditFacility() {
  const api = useProtectionProcedureApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: ({
      procedureId,
      facility,
    }: PatchFacilityParams): Promise<ApiAddFacilityResponse> => {
      const request =
        mapDefaultFacilityFormValuesToApiPutFacilityRequest(facility);
      return api.editFacility(procedureId, request);
    },
    onSuccess: () => {
      snackbar.confirmation("Einrichtung erfolgreich bearbeitet.");
    },
  });
}

interface SyncFacilityParams {
  procedureId: string;
  request: ApiSyncFacilityRequest;
}

export function useSyncFacility() {
  const api = useProtectionProcedureApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: ({
      procedureId,
      request,
    }: SyncFacilityParams): Promise<void> => {
      return api.syncFacility(procedureId, request);
    },
    onSuccess: () => {
      snackbar.confirmation("Einrichtungsdaten erfolgreich synchronisiert.");
    },
  });
}

interface UpdateCaseStatusParams {
  procedureId: string;
  data: ApiCaseStatus;
}

export function useUpdateCaseStatusMutation({
  onSuccess,
  onError,
}: MutationPassThrough<
  UpdateCaseStatusParams,
  ApiGetProcedure200Response
> = {}) {
  const api = useProtectionProcedureApi();
  return useHandledMutation({
    mutationFn: ({ procedureId, data }: UpdateCaseStatusParams) => {
      return api.updateCaseStatus(procedureId, data);
    },
    onSuccess,
    onError,
  });
}

interface PatchAffectedPersonParams {
  procedureId: string;
  person: ApiAffectedPersonDetails;
}

export function useEditAffectedPerson() {
  const api = useProtectionProcedureApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: ({ procedureId, person }: PatchAffectedPersonParams) => {
      return api.editAffectedPerson(procedureId, {
        affectedPersonDetails: person,
      });
    },
    onSuccess: () => {
      snackbar.confirmation("Betroffene Person erfolgreich bearbeitet.");
    },
  });
}

interface SyncAffectedPersonParams {
  procedureId: string;
  request: ApiSyncAffectedPersonRequest;
}

export function useSyncAffectedPerson() {
  const api = useProtectionProcedureApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: ({
      procedureId,
      request,
    }: SyncAffectedPersonParams): Promise<void> => {
      return api.syncAffectedPerson(procedureId, request);
    },
    onSuccess: () => {
      snackbar.confirmation("Personendaten erfolgreich synchronisiert.");
    },
  });
}
