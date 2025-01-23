/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatFacilityName } from "@eshg/lib-portal/formatters/facility";
import { useRouter } from "next/navigation";

import { useGetFacilityFileStateDiff } from "@/lib/baseModule/api/queries/facility";
import { useSyncFacility } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { CentralFileSyncForm } from "@/lib/shared/components/centralFile/sync/CentralFileSyncForm";
import { BaseFacilityDiffForm } from "@/lib/shared/components/centralFile/sync/sections/BaseFacilityDiffForm";

export default function SyncFacilityPage({
  params,
}: Readonly<{
  params: { id: string; fileStateId: string; facilityVersion: number };
}>) {
  const router = useRouter();
  const { data } = useGetFacilityFileStateDiff(params.fileStateId);
  const syncFacility = useSyncFacility(params.id);

  async function handleSync() {
    await syncFacility.mutateAsync(
      {
        referenceVersion: data.referenceVersion,
        facilityVersion: params.facilityVersion,
        fileStateId: params.fileStateId,
      },
      {
        onSuccess: () => router.back(),
      },
    );
  }

  return (
    <CentralFileSyncForm
      onAccept={handleSync}
      onCancel={() => router.back()}
      title={formatFacilityName(data.facilityDetailsDiff.fileState)}
    >
      <BaseFacilityDiffForm diff={data} />
    </CentralFileSyncForm>
  );
}
