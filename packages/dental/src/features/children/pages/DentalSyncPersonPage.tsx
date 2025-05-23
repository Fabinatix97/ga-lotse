/**
 * Copyright 2025 cronn GmbH
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

import { useSyncPerson } from "../api/mutations/details";
import { DentalChildRouteParams } from "../schemas/DentalChildRouteParams";

const RouteParamsSchema = v.object({
  ...DentalChildRouteParams.entries,
  fileStateId: UuidSchema,
  personVersion: PositiveIntegerSchema,
});

export function DentalSyncPersonPage(props: DynamicPageProps) {
  const params = use(props.params);
  const { childId, personVersion, fileStateId } = v.parse(
    RouteParamsSchema,
    params,
  );
  const router = useRouter();
  const { data } = useGetPersonFileStateDiff(fileStateId);
  const syncPerson = useSyncPerson(childId);

  async function handleSync() {
    await syncPerson.mutateAsync(
      {
        referenceVersion: data.referenceVersion,
        personVersion,
        fileStateId,
      },
      {
        onSuccess: router.back,
      },
    );
  }

  return (
    <CentralFileSyncForm
      title={formatPersonName(data.personDetailsDiff.fileState)}
      onAccept={handleSync}
      onCancel={router.back}
    >
      <BasePersonDiffForm diff={data} />
    </CentralFileSyncForm>
  );
}
