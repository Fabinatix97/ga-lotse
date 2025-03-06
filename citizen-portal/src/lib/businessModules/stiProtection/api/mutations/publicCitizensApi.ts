/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddPersonalDetailsRequest,
  ApiBookAppointmentRequest,
} from "@eshg/sti-protection-api";
import { useMutation } from "@tanstack/react-query";

import { useCitizenPublicApi } from "@/lib/businessModules/stiProtection/api/clients";

export function useBookAppointment() {
  const api = useCitizenPublicApi();
  return useMutation({
    mutationFn: (appointment: ApiBookAppointmentRequest) =>
      api.bookAppointment(appointment),
  });
}
export function useCreateAnonymousUser(procedureId: string) {
  const api = useCitizenPublicApi();
  return useMutation({
    mutationFn: ({ pin }: { pin: string }) =>
      api.createAnonymousUser(procedureId, { pin }),
  });
}
export function useAddPersonalDetails(procedureId: string) {
  const api = useCitizenPublicApi();
  return useMutation({
    mutationFn: (details: ApiAddPersonalDetailsRequest) =>
      api.addPersonalDetails(procedureId, details),
  });
}
