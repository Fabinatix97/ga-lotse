/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddUserRequest,
  ApiEmployeeUserKeys,
  ApiUpdateSelfUserRequest,
} from "@eshg/employee-portal-api/base";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useUserApi } from "@/lib/baseModule/api/clients";

export function useUpdateSelfUser() {
  const userApi = useUserApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async ({
      externalChatUsername,
      phoneNumber,
    }: ApiUpdateSelfUserRequest) => {
      await userApi.updateSelfUser({
        phoneNumber,
        externalChatUsername,
      });
    },
    onSuccess: () => {
      snackbar.confirmation("Profil gespeichert");
    },
  });
}

export function useSuggestUser() {
  const userApi = useUserApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async (request: ApiAddUserRequest) => {
      await userApi.suggestUser(request);
    },
    onSuccess: () => {
      snackbar.confirmation("Benutzer wurde erfolgreich vorgeschlagen");
    },
  });
}

export function useAddEmployeeSelfUserKeys() {
  const userApi = useUserApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async (request: ApiEmployeeUserKeys) => {
      await userApi.addEmployeeSelfUserKeys(request);
    },
    onSuccess: () => {
      snackbar.confirmation(
        "Ihr Passwort wurde erstellt. Die Audit Logs werden aufgezeichnet.",
      );
    },
  });
}

export function useDeleteEmployeeUserKeys() {
  const userApi = useUserApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async () => {
      await userApi.deleteEmployeeUserKeys();
    },
    onSuccess: () => {
      snackbar.confirmation("Ihr Passwort wurde gelöscht");
    },
  });
}

export function useInvalidateUserSessions() {
  const userApi = useUserApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (sessions: string[]) =>
      userApi.invalidateActiveSessions({ sessions }),
    onSuccess: () => snackbar.confirmation("Sitzungen wurden getrennt."),
  });
}
