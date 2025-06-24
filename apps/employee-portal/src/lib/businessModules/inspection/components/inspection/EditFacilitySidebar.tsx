/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import { useState } from "react";

import { ApiProcedureStatus } from "@eshg/base-api";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { isNonEmptyString, mapOptionalValue } from "@eshg/lib-portal";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { useUpdateInspectionFacility } from "@/lib/businessModules/inspection/api/mutations/facility";
import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import {
  getInspectionQuery,
  useGetFileNumberCollisionsQuery,
} from "@/lib/businessModules/inspection/api/queries/inspection";
import { EditFileNumberForm } from "@/lib/businessModules/inspection/components/inspection/basedata/EditFileNumberForm";
import { FacilityForm } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { mapApiFacilityStateToFacilityFormValues } from "@/lib/shared/helpers/facilityUtils";

type SidebarMode = "editFacility" | "search" | "editFileNumber";

export function useEditFacilitySidebar() {
  return useSidebarWithFormRef({
    component: EmbeddedEditFacilitySidebar,
  });
}

interface EditFacilitySidebarProps extends SidebarWithFormRefProps {
  inspectionId: string;
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
  const [fileNumber, setFileNumber] = useState(
    inspection.data.facility.fileNumber ?? "",
  );
  const [activeMode, setActiveMode] = useState<SidebarMode>("editFacility");

  const initialValues = mapApiFacilityStateToFacilityFormValues(
    inspection.data.facility.baseFacility,
  );
  const updateInspection = useUpdateInspection();
  const updateFacility = useUpdateInspectionFacility();

  const fileNumberCollisions = useGetFileNumberCollisionsQuery(
    inspection.data.externalId,
    updateFacility.isSuccess,
  );

  if (activeMode === "editFacility") {
    return (
      <FacilityForm
        mode="edit"
        title="Einrichtung bearbeiten"
        submitLabel="Speichern"
        initialValues={initialValues}
        sidebarFormRef={formRef}
        submitting={fileNumberCollisions.isLoading}
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
                  isNonEmptyString(data.fileNumber) &&
                  fileNumber !== data.fileNumber &&
                  inspection.data.status !== ApiProcedureStatus.Draft
                ) {
                  setFileNumber(data.fileNumber);
                  setActiveMode("editFileNumber");
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
  if (activeMode === "editFileNumber") {
    return (
      <EditFileNumberForm
        title="Aktenzeichen Kollision"
        fileNumber={fileNumber}
        fileNumberCollisions={fileNumberCollisions.data}
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
