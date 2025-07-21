/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import { useReducer } from "react";

import { ApiProcedureStatus } from "@eshg/base-api";
import { ApiGetFileNumberCollisionsResponse } from "@eshg/inspection-api";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { isNonEmptyString, mapOptionalValue } from "@eshg/lib-portal";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { useUpdateInspectionFacility } from "@/lib/businessModules/inspection/api/mutations/facility";
import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { getInspectionQuery } from "@/lib/businessModules/inspection/api/queries/inspection";
import { EditFileNumberForm } from "@/lib/businessModules/inspection/components/inspection/basedata/EditFileNumberForm";
import { FacilityForm } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { mapApiFacilityStateToFacilityFormValues } from "@/lib/shared/helpers/facilityUtils";

type SidebarMode = "editFacility" | "editFileNumber";

export function useEditFacilitySidebar() {
  return useSidebarWithFormRef({
    component: EmbeddedEditFacilitySidebar,
  });
}

interface EditFacilitySidebarProps extends SidebarWithFormRefProps {
  inspectionId: string;
}

interface ReducerState {
  fileNumber: string;
  fileNumberCollisions?: ApiGetFileNumberCollisionsResponse;
  activeMode: SidebarMode;
}

interface ReducerAction {
  type: string;
  payload: ReducerState;
}

function createInitialState(fileNumber: string): ReducerState {
  return {
    fileNumber: fileNumber,
    fileNumberCollisions: undefined,
    activeMode: "editFacility",
  };
}

function reducer(state: ReducerState, action: ReducerAction) {
  switch (action.type) {
    case "updated_fileNumber":
      return {
        fileNumber: action.payload.fileNumber,
        fileNumberCollisions: action.payload.fileNumberCollisions,
        activeMode: action.payload.activeMode,
      };
    default:
      return state;
  }
}

function EmbeddedEditFacilitySidebar({
  inspectionId,
  formRef,
  onClose,
}: Readonly<EditFacilitySidebarProps>) {
  const inspectionApi = useInspectionApi();
  const [inspection] = useSuspenseQueries({
    queries: [getInspectionQuery(inspectionApi, inspectionId)],
  });
  const [state, dispatch] = useReducer(
    reducer,
    inspection.data.facility.fileNumber ?? "",
    createInitialState,
  );
  const initialValues = mapApiFacilityStateToFacilityFormValues(
    inspection.data.facility.baseFacility,
  );
  const updateInspection = useUpdateInspection();
  const updateFacility = useUpdateInspectionFacility();

  if (state.activeMode === "editFacility") {
    return (
      <FacilityForm
        mode="edit"
        title="Einrichtung bearbeiten"
        submitLabel="Speichern"
        initialValues={initialValues}
        sidebarFormRef={formRef}
        onSubmit={async (values) => {
          await updateFacility.mutateAsync(
            {
              procedureId: inspection.data.externalId,
              inspectionFacilityId: inspection.data.facility.id,
              facility: values,
            },
            {
              onSuccess: (data) => {
                if (
                  isNonEmptyString(data.facility.fileNumber) &&
                  state.fileNumber !== data.facility.fileNumber &&
                  inspection.data.status !== ApiProcedureStatus.Draft &&
                  data.fileNumberCollisionsResponse &&
                  Object.keys(data.fileNumberCollisionsResponse.collisions)
                    .length > 0
                ) {
                  dispatch({
                    type: "updated_fileNumber",
                    payload: {
                      fileNumber: data.facility.fileNumber,
                      fileNumberCollisions: data.fileNumberCollisionsResponse,
                      activeMode: "editFileNumber",
                    },
                  });
                } else {
                  onClose(true);
                }
              },
            },
          );
        }}
        onCancel={onClose}
      />
    );
  }
  if (state.activeMode === "editFileNumber") {
    return (
      <EditFileNumberForm
        title="Aktenzeichen Kollision"
        fileNumber={state.fileNumber}
        fileNumberCollisions={state.fileNumberCollisions}
        formRef={formRef}
        onCancel={onClose}
        onSubmit={async (values) => {
          await updateInspection.mutateAsync(
            {
              id: inspection.data.externalId,
              apiUpdateInspectionRequest: {
                fileNumberSuffix: mapOptionalValue(values.fileNumberSuffix),
              },
            },
            {
              onSuccess: () => {
                onClose(true);
              },
            },
          );
        }}
      />
    );
  }
}
