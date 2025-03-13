/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import {
  PositiveIntegerSchema,
  UuidSchema,
} from "@eshg/lib-portal/schemas/pageParams";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { useRouter } from "next/navigation";
import * as v from "valibot";

import { useGetPersonFileStateDiff } from "@/lib/baseModule/api/queries/persons";
import { useSyncPerson } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import { CentralFileSyncForm } from "@/lib/shared/components/centralFile/sync/CentralFileSyncForm";
import { BasePersonDiffForm } from "@/lib/shared/components/centralFile/sync/sections/BasePersonDiffForm";

const RouteParamsSchema = v.object({
  ...SchoolEntryProcedureRouteParamsSchema.entries,
  fileStateId: UuidSchema,
  personVersion: PositiveIntegerSchema,
});

export default function SyncPersonPage(props: DynamicPageProps) {
  const { procedureId, personVersion, fileStateId } = v.parse(
    RouteParamsSchema,
    props.params,
  );
  const router = useRouter();
  const { data } = useGetPersonFileStateDiff(fileStateId);
  const syncPerson = useSyncPerson(procedureId);

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
      onAccept={handleSync}
      onCancel={() => router.back()}
      title={formatPersonName(data.personDetailsDiff.fileState)}
    >
      <BasePersonDiffForm diff={data} />
    </CentralFileSyncForm>
  );
}
