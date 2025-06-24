/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useState } from "react";
import { isNonNullish } from "remeda";

import { ApiInspection } from "@eshg/inspection-api";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { mapOptionalValue } from "@eshg/lib-portal";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { useGetFileNumberCollisionsQuery } from "@/lib/businessModules/inspection/api/queries/inspection";
import { EditAdditionalInfoForm } from "@/lib/businessModules/inspection/components/inspection/basedata/EditAdditionalInfoForm";
import { EditFileNumberForm } from "@/lib/businessModules/inspection/components/inspection/basedata/EditFileNumberForm";

type SidebarMode = "editAdditionalInfo" | "editFileNumber";

export function useEditAdditionalInfoSidebar(): UseSidebarWithFormRefResult<EditAdditionalInfoSidebarProps> {
  return useSidebarWithFormRef({ component: EditAdditionalInfoSidebar });
}

interface EditAdditionalInfoSidebarProps extends SidebarWithFormRefProps {
  inspection: ApiInspection;
}

function EditAdditionalInfoSidebar({
  inspection,
  ...props
}: Readonly<EditAdditionalInfoSidebarProps>) {
  const [activeMode, setActiveMode] =
    useState<SidebarMode>("editAdditionalInfo");
  const updateInspection = useUpdateInspection();

  const { data: fileNumberCollisions } = useGetFileNumberCollisionsQuery(
    inspection.externalId,
    isNonNullish(inspection.facility.fileNumber),
  );

  if (activeMode === "editAdditionalInfo") {
    return (
      <EditAdditionalInfoForm
        title="Zusatzinfos bearbeiten"
        inspection={inspection}
        formRef={props.formRef}
        onCancel={props.onClose}
        onEditFileNumber={() => {
          if (isNonNullish(inspection.facility.fileNumber))
            setActiveMode("editFileNumber");
        }}
        onSubmit={async (values) => {
          await updateInspection.mutateAsync(
            {
              id: inspection.externalId,
              apiUpdateInspectionRequest: {
                challenging: mapOptionalValue(values.challenging),
                assigneeId: mapOptionalValue(values.assigneeId),
              },
            },
            {
              onSuccess: () => {
                props.onClose(true);
              },
            },
          );
        }}
      />
    );
  }
  if (
    activeMode === "editFileNumber" &&
    isNonNullish(inspection.facility.fileNumber)
  ) {
    return (
      <EditFileNumberForm
        title="Aktenzeichen Kollision"
        formRef={props.formRef}
        fileNumberCollisions={fileNumberCollisions}
        fileNumber={inspection.facility.fileNumber}
        onBack={() => setActiveMode("editAdditionalInfo")}
        onCancel={props.onClose}
        onSubmit={async (values) => {
          await updateInspection.mutateAsync(
            {
              id: inspection.externalId,
              apiUpdateInspectionRequest: {
                fileNumberSuffix: mapOptionalValue(values.fileNumberSuffix),
              },
            },
            {
              onSuccess: () => {
                props.onClose(true);
              },
            },
          );
        }}
      />
    );
  }
}
