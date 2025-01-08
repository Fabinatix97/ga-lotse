/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiPatchEmployeeOmsProcedureFacilityRequest,
  ApiPostEmployeeOmsProcedureRequest,
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
