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

import { useSyncCustodian } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";

export function CustodianSyncForm({
  procedureId,
  custodianId,
  fileStateId,
  custodianVersion,
}: {
  procedureId: string;
  custodianId: string;
  fileStateId: string;
  custodianVersion: number;
}) {
  const router = useRouter();
  const { data } = useGetPersonFileStateDiff(fileStateId);
  const syncCustodian = useSyncCustodian();

  async function handleSync() {
    await syncCustodian.mutateAsync(
      {
        procedureId: procedureId,
        custodianId: custodianId,
        request: {
          referenceVersion: data.referenceVersion,
          custodianVersion: custodianVersion,
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
