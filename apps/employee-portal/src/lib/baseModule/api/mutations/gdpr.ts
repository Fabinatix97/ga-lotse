/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddCentralFileIdToGdprProcedureRequest,
  ApiAddGdprProcedureRequest,
  ApiGdprProcedureStatus,
} from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import {
  ApiGdprProcedureType,
  GdprValidationTaskApiInterface,
} from "@eshg/lib-procedures-api";

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
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: () => gdprProcedureApi.refreshStatus(id),
    onSuccess: ({ status }) => {
      if (status === ApiGdprProcedureStatus.Closed) {
        snackbar.confirmation("Vorgang ist abgeschlossen.");
      } else {
        snackbar.notification(
          "Noch nicht alle Fachabteilungen haben die notwendige manuelle Freigabe der Daten durchgeführt.",
        );
      }
    },
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
