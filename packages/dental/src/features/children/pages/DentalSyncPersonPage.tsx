/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  BasePersonDiffForm,
  CentralFileSyncForm,
  useGetPersonFileStateDiff,
} from "@eshg/lib-employee-portal";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import {
  PositiveIntegerSchema,
  UuidSchema,
} from "@eshg/lib-portal/schemas/pageParams";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { useRouter } from "next/navigation";
import { use } from "react";
import * as v from "valibot";

import { useSyncPerson } from "@/features/children/api/mutations/details";
import { DentalChildRouteParams } from "@/features/children/schemas/DentalChildRouteParams";

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
      onAccept={handleSync}
      onCancel={router.back}
      title={formatPersonName(data.personDetailsDiff.fileState)}
    >
      <BasePersonDiffForm diff={data} />
    </CentralFileSyncForm>
  );
}
