/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddCentralFileIdToGdprProcedureRequest,
  ApiAddGdprProcedureRequest,
} from "@eshg/employee-portal-api/base";
import {
  ApiGdprProcedureType,
  GdprValidationTaskApiInterface,
} from "@eshg/employee-portal-api/businessProcedures";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useGdprProcedureApi } from "@/lib/baseModule/api/clients";

export function useAddGdprProcedure() {
  const gdprProcedureApi = useGdprProcedureApi();
  return useHandledMutation({
    mutationFn: async (request: ApiAddGdprProcedureRequest) => {
      return await gdprProcedureApi.addGdprProcedure(request);
    },
  });
}

export function useAddCentralFileIdToGdprProcedure(id: string) {
  const gdprProcedureApi = useGdprProcedureApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async (request: ApiAddCentralFileIdToGdprProcedureRequest) => {
      await gdprProcedureApi.addCentralFileIdToGdprProcedure(id, request);
    },
    onSuccess: () => {
      snackbar.confirmation("Stammdaten erfolgreich angeheftet");
    },
  });
}

export function useSetMatterOfConcern(id: string, version: number) {
  const gdprProcedureApi = useGdprProcedureApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (matterOfConcern: string) =>
      gdprProcedureApi.setMatterOfConcern(id, {
        version,
        concern: matterOfConcern,
      }),
    onSuccess: () => {
      snackbar.confirmation("Anliegen gespeichert");
    },
  });
}

type StatusTransition =
  | {
      type: "start";
    }
  | {
      type: "cancel" | "close";
      internalNote: string;
    };

export function useChangeProcedureStatus(id: string, version: number) {
  const gdprProcedureApi = useGdprProcedureApi();

  return useHandledMutation({
    mutationFn: async (transition: StatusTransition) => {
      switch (transition.type) {
        case "start":
          await gdprProcedureApi.startProcedure(id, { version });
          break;
        case "cancel":
          await gdprProcedureApi.cancelProcedure(id, {
            version,
            internalNote: transition.internalNote,
          });
          break;
        case "close":
          await gdprProcedureApi.closeProcedure(id, {
            version,
            internalNote: transition.internalNote,
          });
          break;
      }
    },
  });
}

export function useRefreshProcedureStatus(id: string) {
  const gdprProcedureApi = useGdprProcedureApi();
  return useHandledMutation({
    mutationFn: () => gdprProcedureApi.refreshStatus(id),
  });
}

export function useCloseValidationTask(
  gdprValidationTaskApi: GdprValidationTaskApiInterface,
  type: ApiGdprProcedureType,
) {
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (id: string) =>
      gdprValidationTaskApi.closeGdprValidationTask(id),
    onSuccess: () =>
      snackbar.confirmation(
        `DSGVO Auftrag zur ${type === ApiGdprProcedureType.OfAccess ? "Datenauskunft" : "Löschung"} wurde abgeschlossen.`,
      ),
  });
}
