/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useRouter } from "next/navigation";

import {
  BaseFacilityDiffForm,
  CentralFileSyncForm,
} from "@eshg/lib-employee-portal";
import { formatFacilityName } from "@eshg/lib-portal";

import { useGetFacilityFileStateDiff } from "@/lib/baseModule/api/queries/facility";
import { useSyncFacility } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";

export function FacilitySyncForm({
  procedureId,
  fileStateId,
  facilityVersion,
}: {
  procedureId: string;
  fileStateId: string;
  facilityVersion: number;
}) {
  const router = useRouter();
  const { data } = useGetFacilityFileStateDiff(fileStateId);
  const syncFacility = useSyncFacility();

  async function handleSync() {
    await syncFacility.mutateAsync(
      {
        procedureId: procedureId,
        request: {
          referenceVersion: data.referenceVersion,
          facilityVersion: facilityVersion,
          fileStateId: fileStateId,
        },
      },
      {
        onSuccess: () => router.back(),
      },
    );
  }

  return (
    <CentralFileSyncForm
      title={formatFacilityName(data.facilityDetailsDiff.fileState)}
      onAccept={handleSync}
      onCancel={() => router.back()}
    >
      <BaseFacilityDiffForm diff={data} />
    </CentralFileSyncForm>
  );
}
