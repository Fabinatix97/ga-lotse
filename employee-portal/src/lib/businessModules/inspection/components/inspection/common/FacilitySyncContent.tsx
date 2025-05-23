/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useRouter } from "next/navigation";

import {
  BaseFacilityDiffForm,
  CentralFileSyncForm,
} from "@eshg/lib-employee-portal";
import { formatFacilityName } from "@eshg/lib-portal/formatters/facility";

import { useGetFacilityFileStateDiff } from "@/lib/baseModule/api/queries/facility";
import { useSyncFacility } from "@/lib/businessModules/inspection/api/mutations/inspection";

export function FacilitySyncContent({
  procedureId,
  fileStateId,
}: Readonly<{
  procedureId: string;
  fileStateId: string;
}>) {
  const router = useRouter();
  const { data } = useGetFacilityFileStateDiff(fileStateId);
  const { mutateAsync: syncFacility } = useSyncFacility();

  async function handleSync() {
    await syncFacility(
      {
        procedureId,
        facilityVersion: data.referenceVersion,
      },
      {
        onSuccess: router.back,
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
