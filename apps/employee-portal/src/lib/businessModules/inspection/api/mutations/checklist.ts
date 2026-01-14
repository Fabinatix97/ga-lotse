/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import {
  ApiUpdateChecklistElementsInner,
  ChecklistDeleteFileRequest,
  UpdateChecklistRequest,
} from "@eshg/inspection-api";
import { unwrapRawResponse, useSnackbar } from "@eshg/lib-portal";

import { useChecklistApi } from "@/lib/businessModules/inspection/api/clients";
import { isServiceWorkerResponse } from "@/serviceWorker/common/common";

interface UploadChecklistFileParameter {
  file: File;
  inspectionExternalId: string;
  checklistId: string;
  updateElementDto: ApiUpdateChecklistElementsInner;
}

interface DeleteChecklistFileParameter extends ChecklistDeleteFileRequest {
  fileName: string;
}

export function useUploadChecklistFile() {
  const checklistApi = useChecklistApi();
  const snackbar = useSnackbar();
  return useMutation({
    mutationFn: async (data: UploadChecklistFileParameter) => {
      // Clone file object to work-around weird Chromium service-worker-issue 🤷
      const file = new File([data.file], data.file.name, {
        type: data.file.type,
      });
      const response = await checklistApi.checklistUploadFileRaw({
        file,
        uploadMediaFileRequest: {
          checklistId: data.checklistId,
          updateElementDto: data.updateElementDto,
          inspectionExternalId: data.inspectionExternalId,
          fileExternalId: uuidv4(),
        },
      });
      const serverResponse = await unwrapRawResponse(response);
      return {
        response: serverResponse,
        fileName: data.file.name,
        serviceWorkerResponse: isServiceWorkerResponse(response),
      };
    },
    onSuccess: (data) => {
      if (data.serviceWorkerResponse) {
        snackbar.notification(data.fileName + " zwischengespeichert.");
      } else {
        snackbar.confirmation(data.fileName + " erfolgreich hochgeladen.");
      }
    },
    onError: (_error, data) => {
      snackbar.error(data.file.name + " konnte nicht gespeichert werden.");
    },
  });
}

export function useDeleteChecklistFile() {
  const checklistApi = useChecklistApi();
  const snackbar = useSnackbar();
  return useMutation({
    mutationFn: async (data: DeleteChecklistFileParameter) => {
      const { fileName, ...req } = data;
      const response = await checklistApi.checklistDeleteFileRaw(req);
      await unwrapRawResponse(response);
      return {
        fileName,
        serviceWorkerResponse: isServiceWorkerResponse(response),
      };
    },
    onSuccess: (data) => {
      if (data.serviceWorkerResponse) {
        snackbar.notification(data.fileName + " löschen zwischengespeichert.");
      } else {
        snackbar.confirmation(data.fileName + " erfolgreich gelöscht.");
      }
    },
    onError: (_error, data) => {
      snackbar.error(data.fileName + " konnte nicht gelöscht werden.");
    },
  });
}

export function useUpdateChecklist() {
  const checklistApi = useChecklistApi();
  const snackbar = useSnackbar();
  return useMutation({
    mutationFn: async (req: UpdateChecklistRequest) => {
      const response = await checklistApi.updateChecklistRaw(req);
      const serverResponse = await unwrapRawResponse(response);
      return {
        ...serverResponse,
        serviceWorkerResponse: isServiceWorkerResponse(response),
      };
    },
    onSuccess: (data) => {
      if (data.serviceWorkerResponse) {
        snackbar.notification("Zwischengespeichert");
      } else {
        snackbar.confirmation("Erfolgreich gespeichert");
      }
    },
    onError: () => {
      snackbar.error("Daten konnten nicht gespeichert werden.");
    },
  });
}
