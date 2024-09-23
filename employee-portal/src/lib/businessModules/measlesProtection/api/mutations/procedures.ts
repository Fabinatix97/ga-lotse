/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGetReferencePersonResponse } from "@eshg/employee-portal-api/base";
import {
  ApiAccessRestriction,
  ApiAccessRestrictionLetter,
  ApiAddCustodianRequest,
  ApiAddCustodianResponse,
  ApiAddFacilityRequest,
  ApiAddFacilityResponse,
  ApiCaseStatus,
  ApiCreateAccessRestriction,
  ApiCreateAccessRestrictionLetter,
  ApiCreateMonetaryFine,
  ApiCreatePersonRequest,
  ApiCreatePersonResponse,
  ApiCreateProofRequestLetter,
  ApiDataOrigin,
  ApiGetProcedure200Response,
  ApiMPFacilityType,
  ApiMonetaryFine,
  ApiOpenProcedureResponse,
  ApiProofSubmission,
  ApiResponse,
  ApiSaveProofRequestLetter,
  ApiUpdateAccessRestriction,
  ApiUpdateProcedureRequest,
  CreateProofSubmissionRequest,
} from "@eshg/employee-portal-api/measlesProtection";
import { getFilenameFromHeader } from "@eshg/lib-portal/api/files/download";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { useMutation } from "@tanstack/react-query";
import { isNullish } from "remeda";

import {
  useAccessRestrictionApi,
  useDraftProcedureApi,
  useMonetaryFineApi,
  useProofRequestLetterApi,
  useProofSubmissionApi,
  useProtectionProcedureApi,
} from "@/lib/businessModules/measlesProtection/api/clients";
import { MutationPassThrough } from "@/lib/businessModules/measlesProtection/api/mutations/types";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";
import { ValidUpdateProcedureForm } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";
import { mapBaseAddressToApi } from "@/lib/shared/components/form/address/helpers";

interface UpdateProcedureParams {
  id: string;
  data: ApiUpdateProcedureRequest;
}

export function useUpdateProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<ApiGetProcedure200Response, UpdateProcedureParams>) {
  const measlesProtectionApi = useProtectionProcedureApi();
  return useHandledMutation({
    mutationFn: ({ id, data }: UpdateProcedureParams) => {
      return measlesProtectionApi.updateProcedure(id, data);
    },
    mutationKey: measlesProtectionApiQueryKey(["procedures"]), // reload all procedures for now
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
}: MutationPassThrough<ApiOpenProcedureResponse, OpenProcedureParams>) {
  const measlesProtectionApi = useDraftProcedureApi();
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
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}

export function useCreateDraftProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<ApiCreatePersonResponse, ApiCreatePersonRequest> = {}) {
  const api = useDraftProcedureApi();
  return useHandledMutation({
    mutationFn: (data: ApiCreatePersonRequest) => api.createPerson(data),
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}

interface AddCustodianParams {
  procedureId: string;
  data: ApiAddCustodianRequest;
}

export function useAddCustodianMutation({
  onSuccess,
  onError,
}: MutationPassThrough<ApiAddCustodianResponse, AddCustodianParams>) {
  const api = useDraftProcedureApi();
  return useHandledMutation({
    mutationFn: ({ procedureId, data }: AddCustodianParams) =>
      api.addCustodian(procedureId, data),
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}

export function useProceduresForPersonSearch() {
  const measlesProtectionApi = useProtectionProcedureApi();
  return useHandledMutation({
    mutationFn: async (person: ApiGetReferencePersonResponse) =>
      measlesProtectionApi.getProceduresForPerson({ person }),
    mutationKey: measlesProtectionApiQueryKey(["procedures", "for-person"]),
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
}: MutationPassThrough<ApiProofSubmission, AddProofSubmissionParams>) {
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
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
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
}: MutationPassThrough<File, AddProofRequestLetterParams>) {
  const api = useProofRequestLetterApi();
  return useHandledMutation({
    mutationFn: async ({ id, data }: AddProofRequestLetterParams) => {
      const response = await api.createProofRequestLetterRaw({
        id: id,
        apiCreateProofRequestLetter: data,
      });
      return createFile(response);
    },
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
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
}: MutationPassThrough<void, SaveProofRequestLetterParams>) {
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
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
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
}: MutationPassThrough<ApiMonetaryFine, AddFineParams>) {
  const api = useMonetaryFineApi();
  return useHandledMutation({
    mutationFn: ({ id, data }: AddFineParams) => {
      return api.createMonetaryFine(id, data);
    },
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
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
}: MutationPassThrough<ApiAccessRestriction, AddAccessRestrictionParams>) {
  const api = useAccessRestrictionApi();
  return useHandledMutation({
    mutationFn: ({ id, data }: AddAccessRestrictionParams) => {
      return api.createAccessRestriction(id, data);
    },
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
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
  ApiAccessRestrictionLetter,
  AddAccessRestrictionLetterParams
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
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
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
}: MutationPassThrough<ApiAccessRestriction, UpdateAccessRestrictionParams>) {
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
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}

// Replace with generated API type from backend
export type MeaslesFacility = BaseFacility &
  Partial<{
    type: ApiMPFacilityType;
    otherFacilityTypeInformation?: string;
  }>;

// In the base module emails and phone numbers for contact persons are optional
// We need to look into it why that is different with our module
function mapMeaslesFacilityToApiAddFacilityRequest(
  facility: MeaslesFacility,
): ApiAddFacilityRequest {
  return {
    facility: {
      ...facility,
      contactAddress: mapBaseAddressToApi(facility.contactAddress),
      differentBillingAddress: facility.billingAddress
        ? mapBaseAddressToApi(facility.billingAddress)
        : undefined,
      contactPersons: facility.contactPersons?.map((person) => ({
        ...person,
        firstName: person.firstName,
        emailAddress: person.emailAddress,
        phoneNumber: person.phoneNumber,
        salutation: mapOptionalValue(person.salutation),
        title: mapOptionalValue(person.title),
        role: mapOptionalValue(person.role),
      })),
      dataOrigin: ApiDataOrigin.Manual,
    },
    type: facility.type!,
    otherFacilityTypeInformation: facility.otherFacilityTypeInformation,
  };
}

interface AddFacilityParams {
  procedureId: string;
  facility: MeaslesFacility;
}

export function useAddFacilityMutation({
  onSuccess,
}: MutationPassThrough<ApiAddFacilityResponse, AddFacilityParams>) {
  const api = useDraftProcedureApi();
  return useMutation({
    mutationFn: ({
      procedureId,
      facility,
    }: AddFacilityParams): Promise<ApiAddFacilityResponse> => {
      const request = mapMeaslesFacilityToApiAddFacilityRequest(facility);
      return api.addFacility(procedureId, request);
    },
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
  });
}

interface PatchFacilityParams {
  facility: MeaslesFacility;
}

export function usePatchFacilityMutation({
  onSuccess,
  onError,
}: MutationPassThrough<
  PatchFacilityParams["facility"] | undefined,
  PatchFacilityParams
> = {}) {
  // const api = useDraftProcedureApi();
  return useMutation({
    mutationFn: ({ facility }: PatchFacilityParams) => {
      // Todo: call backend to patch the facility
      return new Promise<MeaslesFacility | undefined>((res) => {
        setTimeout(() => res(facility), 1000);
      });
    },
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
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
  ApiGetProcedure200Response,
  UpdateCaseStatusParams
> = {}) {
  const api = useProtectionProcedureApi();
  return useHandledMutation({
    mutationFn: ({ procedureId, data }: UpdateCaseStatusParams) => {
      return api.updateCaseStatus(procedureId, data);
    },
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}
