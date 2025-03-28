/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PortalErrorCode } from "@eshg/lib-portal/errorHandling/PortalErrorCode";
import { resolveError } from "@eshg/lib-portal/errorHandling/errorResolvers";
import {
  ApiAddPersonalDetailsRequest,
  ApiBookAppointmentRequest,
} from "@eshg/sti-protection-api";
import { useMutation } from "@tanstack/react-query";
import assert from "assert";

import { useCitizenPublicApi } from "@/lib/businessModules/stiProtection/api/clients";

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

function returnConflict(e: unknown) {
  const resolved = resolveError(e);
  if (resolved?.errorCode === PortalErrorCode.UnexpectedError) {
    return PortalErrorCode.Conflict;
  }
  throw e;
}
