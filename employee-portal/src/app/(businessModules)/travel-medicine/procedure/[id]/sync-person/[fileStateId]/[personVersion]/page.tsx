/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import * as v from "valibot";

import {
  BasePersonDiffForm,
  CentralFileSyncForm,
  useGetPersonFileStateDiff,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps, formatPersonName } from "@eshg/lib-portal";
import { PositiveIntegerSchema, UuidSchema } from "@eshg/lib-portal/universal";

import { useSyncPerson } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";

const RouteParamsSchema = v.object({
  id: UuidSchema,
  fileStateId: UuidSchema,
  personVersion: PositiveIntegerSchema,
});

export default function SyncPersonPage(props: DynamicPageProps) {
  const params = use(props.params);
  const { id, fileStateId, personVersion } = v.parse(RouteParamsSchema, params);
  const router = useRouter();
  const { data } = useGetPersonFileStateDiff(fileStateId);
  const syncPerson = useSyncPerson(id);

  async function handleSync() {
    await syncPerson.mutateAsync(
      {
        referenceVersion: data.referenceVersion,
        personVersion,
        fileStateId,
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
