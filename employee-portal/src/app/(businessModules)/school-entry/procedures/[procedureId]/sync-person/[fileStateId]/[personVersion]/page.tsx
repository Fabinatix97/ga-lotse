/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { useRouter } from "next/navigation";

import { SchoolEntryProcedurePageParams } from "@/app/(businessModules)/school-entry/procedures/[procedureId]/layout";
import { useGetPersonFileStateDiff } from "@/lib/baseModule/api/queries/persons";
import { useSyncPerson } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { CentralFileSyncForm } from "@/lib/shared/components/centralFile/sync/CentralFileSyncForm";
import { BasePersonDiffForm } from "@/lib/shared/components/centralFile/sync/sections/BasePersonDiffForm";

export default function SyncPersonPage({
  params,
}: Readonly<{
  params: SchoolEntryProcedurePageParams & {
    fileStateId: string;
    personVersion: number;
  };
}>) {
  const router = useRouter();
  const { data } = useGetPersonFileStateDiff(params.fileStateId);
  const syncPerson = useSyncPerson(params.procedureId);

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
