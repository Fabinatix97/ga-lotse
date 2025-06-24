/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";

import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { mapOptionalValue } from "@eshg/lib-portal";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { getFileNumberCollisionsQuery } from "@/lib/businessModules/inspection/api/queries/inspection";
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
}

function EditFileNumberSidebar({
  inspectionId,
  fileNumber,
  ...props
}: Readonly<EditFileNumberSidebarProps>) {
  const inspectionApi = useInspectionApi();
  const updateInspection = useUpdateInspection();
  const [{ data: fileNumberCollisions }] = useSuspenseQueries({
    queries: [getFileNumberCollisionsQuery(inspectionApi, inspectionId)],
  });

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
