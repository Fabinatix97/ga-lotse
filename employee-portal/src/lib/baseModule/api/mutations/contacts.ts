/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddContactRequest,
  ApiUpdateContactRequest,
} from "@eshg/employee-portal-api/base";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useContactApi } from "@/lib/baseModule/api/clients";

export function useUpdateContactMutation(
  id: string,
  successMessage = "Kontakt wurde geändert",
) {
  const contactApi = useContactApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async (request: ApiUpdateContactRequest) => {
      return await contactApi.updateContact(id, request);
    },
    onSuccess: () => {
      snackbar.confirmation(successMessage);
    },
  });
}

export function useAddContactMutation() {
  const contactApi = useContactApi();

  return useHandledMutation({
    mutationFn: async (request: ApiAddContactRequest) => {
      return await contactApi.addContact(request);
    },
  });
}

export function useImportPersonContactMutation() {
  const contactApi = useContactApi();

  return useHandledMutation({
    mutationFn: async (vCard: File) => {
      return await contactApi.importPersonContact(vCard);
    },
  });
}

export function useImportInstitutionContactMutation() {
  const contactApi = useContactApi();

  return useHandledMutation({
    mutationFn: async (vCard: File) => {
      return await contactApi.importInstitutionContact(vCard);
    },
  });
}
