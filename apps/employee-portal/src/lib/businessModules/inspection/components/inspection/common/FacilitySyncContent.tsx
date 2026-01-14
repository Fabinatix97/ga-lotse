/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useRouter } from "next/navigation";
import { isNonNullish } from "remeda";

import { ApiProcedureStatus } from "@eshg/base-api";
import {
  BaseFacilityDiffForm,
  CentralFileSyncForm,
} from "@eshg/lib-employee-portal";
import { formatFacilityName } from "@eshg/lib-portal";

import { useGetFacilityFileStateDiff } from "@/lib/baseModule/api/queries/facility";
import { useSyncFacility } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { useEditFileNumberSidebar } from "@/lib/businessModules/inspection/components/inspection/basedata/EditFileNumberSidebar";

export function FacilitySyncContent({
  procedureId,
  fileStateId,
  fileNumber,
  procedureStatus,
}: Readonly<{
  procedureId: string;
  fileStateId: string;
  fileNumber?: string;
  procedureStatus: ApiProcedureStatus;
}>) {
  const router = useRouter();
  const { data } = useGetFacilityFileStateDiff(fileStateId);
  const syncFacility = useSyncFacility();
  const editFileNumberSidebar = useEditFileNumberSidebar(() => {
    router.back();
  });

  async function handleSync() {
    await syncFacility.mutateAsync(
      {
        procedureId,
        facilityVersion: data.referenceVersion,
      },
      {
        onSuccess: (data) => {
          if (
            isNonNullish(data.inspection.facility.fileNumber) &&
            fileNumber !== data.inspection.facility.fileNumber &&
            procedureStatus !== ApiProcedureStatus.Draft &&
            data.fileNumberCollisionsResponse &&
            Object.keys(data.fileNumberCollisionsResponse.collisions).length > 0
          ) {
            editFileNumberSidebar.open({
              inspectionId: procedureId,
              fileNumber: data.inspection.facility.fileNumber,
              fileNumberCollisions: data.fileNumberCollisionsResponse,
            });
          } else {
            router.back();
          }
        },
      },
    );
  }

  return (
    <CentralFileSyncForm
      title={formatFacilityName(data.facilityDetailsDiff.fileState)}
      onAccept={handleSync}
      onCancel={router.back}
    >
      <BaseFacilityDiffForm diff={data} />
    </CentralFileSyncForm>
  );
}
