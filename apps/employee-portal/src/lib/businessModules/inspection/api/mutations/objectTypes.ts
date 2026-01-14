/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUpdateObjectTypeRequest } from "@eshg/inspection-api";
import {
  mapOptionalValue,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";

import { useObjectTypeApi } from "@/lib/businessModules/inspection/api/clients";
import { EditableObjectType } from "@/lib/businessModules/inspection/components/objectType/EditObjectTypeSidebar";

export function useUpdateObjectType() {
  const objectTypeApi = useObjectTypeApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async (objectType: EditableObjectType) => {
      const request =
        mapEditableObjectTypeToUpdateObjectTypeRequest(objectType);
      await objectTypeApi.updateObjectType(objectType.id, request);
    },
    onSuccess: () => {
      snackbar.confirmation("Erfolgreich gespeichert!");
    },
  });
}

function mapEditableObjectTypeToUpdateObjectTypeRequest(
  objectType: EditableObjectType,
): ApiUpdateObjectTypeRequest {
  return {
    routineInterval:
      objectType.routineIntervalRadio === "false"
        ? null
        : mapOptionalValue(objectType.routineInterval),
    complaintInterval:
      objectType.complaintIntervalRadio === "false"
        ? null
        : mapOptionalValue(objectType.complaintInterval),
    standardDuration: mapOptionalValue(objectType.standardDuration),
    standardBufferTime: mapOptionalValue(objectType.standardBufferTime),
    emailAnnouncement: objectType.emailAnnouncement,
    legalBasis: mapOptionalValue(objectType.legalBasis),
  };
}
