/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { useRouter } from "next/navigation";

import { OfficialMedicalServiceDetailsPageParams } from "@/app/(businessModules)/official-medical-service/procedures/[id]/layout";
import { useGetPersonFileStateDiff } from "@/lib/baseModule/api/queries/persons";
import { useSyncAffectedPerson } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { CentralFileSyncForm } from "@/lib/shared/components/centralFile/sync/CentralFileSyncForm";
import { BasePersonDiffForm } from "@/lib/shared/components/centralFile/sync/sections/BasePersonDiffForm";

export default function SyncAffectedPersonPage({
  params,
}: Readonly<{
  params: OfficialMedicalServiceDetailsPageParams & {
    fileStateId: string;
    personVersion: number;
  };
}>) {
  const router = useRouter();
  const { data } = useGetPersonFileStateDiff(params.fileStateId);
  const syncPerson = useSyncAffectedPerson(params.id);

  async function handleSync() {
    await syncPerson.mutateAsync(
      {
        referenceVersion: data.referenceVersion,
        personVersion: params.personVersion,
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
      title={formatPersonName(data.personDetailsDiff.fileState)}
    >
      <BasePersonDiffForm diff={data} />
    </CentralFileSyncForm>
  );
}
