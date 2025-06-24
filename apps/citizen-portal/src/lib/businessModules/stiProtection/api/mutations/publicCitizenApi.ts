/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import assert from "assert";

import { PortalErrorCode, useFileDownload } from "@eshg/lib-portal";
import {
  ApiAddPersonalDetailsRequest,
  ApiBookAppointmentRequest,
} from "@eshg/sti-protection-api";

import { citizenPublicApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";
import { useCitizenPublicApi } from "@/lib/businessModules/stiProtection/api/clients";

import { returnConflict } from "./helper";

export function useBookAppointment() {
  const api = useCitizenPublicApi();
  const ifConflict = useInvalidateAvailableAppointmentsIfConflict();

  return useMutation({
    mutationFn: (appointment: ApiBookAppointmentRequest) =>
      api.bookAppointment(appointment).catch(returnConflict).then(ifConflict),
  });
}
export function useCreateAnonymousUser(procedureId: string) {
  const api = useCitizenPublicApi();
  const ifConflict = useInvalidateAvailableAppointmentsIfConflict();
  return useMutation({
    mutationFn: ({
      pin,
      personalDetails,
    }: {
      pin: string;
      personalDetails?: ApiAddPersonalDetailsRequest | undefined;
    }) =>
      api
        .createAnonymousUser(procedureId, { pin, personalDetails })
        .catch(returnConflict)
        .then(ifConflict),
  });
}
export function useAddPersonalDetails(procedureId: string) {
  const api = useCitizenPublicApi();
  const ifConflict = useInvalidateAvailableAppointmentsIfConflict();
  return useMutation({
    mutationFn: (details: ApiAddPersonalDetailsRequest) =>
      api
        .addPersonalDetails(procedureId, details)
        .catch(returnConflict)
        .then(ifConflict),
  });
}

export function useCancelPendingAppointment(procedureId?: string) {
  const api = useCitizenPublicApi();
  return useMutation({
    mutationFn: () => {
      assert.ok(procedureId);
      return api.cancelPendingAppointment(procedureId);
    },
  });
}

export function useAnonymousIdentificationDocumentQuery(procedureId: string) {
  const publicCitizenApi = useCitizenPublicApi();
  return useFileDownload(() =>
    publicCitizenApi.getInitialCitizenAnonymousIdentificationDocumentRaw({
      id: procedureId,
    }),
  );
}

export function useInvalidateAvailableAppointmentsIfConflict() {
  const client = useQueryClient();
  return async <T>(returnValue: T): Promise<T> => {
    if (returnValue === PortalErrorCode.Conflict) {
      await client.invalidateQueries({
        queryKey: citizenPublicApiQueryKey(["getFreeAppointmentsForCitizen"]),
      });
    }
    return returnValue;
  };
}
