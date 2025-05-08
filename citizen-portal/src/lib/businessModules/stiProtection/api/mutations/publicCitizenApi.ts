/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";
import assert from "assert";

import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import {
  ApiAddPersonalDetailsRequest,
  ApiBookAppointmentRequest,
} from "@eshg/sti-protection-api";

import { useCitizenPublicApi } from "@/lib/businessModules/stiProtection/api/clients";

import { returnConflict } from "./helper";

export function useBookAppointment() {
  const api = useCitizenPublicApi();
  return useMutation({
    mutationFn: (appointment: ApiBookAppointmentRequest) =>
      api.bookAppointment(appointment).catch(returnConflict),
  });
}
export function useCreateAnonymousUser(procedureId: string) {
  const api = useCitizenPublicApi();
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
        .catch(returnConflict),
  });
}
export function useAddPersonalDetails(procedureId: string) {
  const api = useCitizenPublicApi();
  return useMutation({
    mutationFn: (details: ApiAddPersonalDetailsRequest) =>
      api.addPersonalDetails(procedureId, details).catch(returnConflict),
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
