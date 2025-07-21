/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetFileNumberCollisionsResponse } from "@eshg/inspection-api";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { mapOptionalValue } from "@eshg/lib-portal";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { EditFileNumberForm } from "@/lib/businessModules/inspection/components/inspection/basedata/EditFileNumberForm";

export function useEditFileNumberSidebar(onClose: () => void) {
  return useSidebarWithFormRef({
    component: EditFileNumberSidebar,
    onClose: onClose,
  });
}

interface EditFileNumberSidebarProps extends SidebarWithFormRefProps {
  inspectionId: string;
  fileNumber: string;
  fileNumberCollisions: ApiGetFileNumberCollisionsResponse;
}

function EditFileNumberSidebar({
  inspectionId,
  fileNumber,
  fileNumberCollisions,
  ...props
}: Readonly<EditFileNumberSidebarProps>) {
  const updateInspection = useUpdateInspection();

  return (
    <EditFileNumberForm
      title="Aktenzeichen Kollision"
      fileNumber={fileNumber}
      fileNumberCollisions={fileNumberCollisions}
      formRef={props.formRef}
      onCancel={props.onClose}
      onSubmit={async (values) => {
        await updateInspection.mutateAsync(
          {
            id: inspectionId,
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
