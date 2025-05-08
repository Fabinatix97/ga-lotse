/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useRouter } from "next/navigation";

import {
  BasePersonDiffForm,
  CentralFileSyncForm,
  useGetPersonFileStateDiff,
} from "@eshg/lib-employee-portal";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";

import { useSyncAffectedPerson } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";

export function PersonSyncForm({
  procedureId,
  fileStateId,
  personVersion,
}: {
  procedureId: string;
  fileStateId: string;
  personVersion: number;
}) {
  const router = useRouter();
  const { data } = useGetPersonFileStateDiff(fileStateId);
  const syncAffectedPerson = useSyncAffectedPerson();

  async function handleSync() {
    await syncAffectedPerson.mutateAsync(
      {
        procedureId: procedureId,
        request: {
          referenceVersion: data.referenceVersion,
          personVersion: personVersion,
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
      title={formatPersonName(data.personDetailsDiff.fileState)}
      onAccept={handleSync}
      onCancel={() => router.back()}
    >
      <BasePersonDiffForm diff={data} />
    </CentralFileSyncForm>
  );
}
