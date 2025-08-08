/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box } from "@mui/joy";
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

import { useSyncPerson } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";

const RouteParamsSchema = v.object({
  ...SchoolEntryProcedureRouteParamsSchema.entries,
  fileStateId: UuidSchema,
  personVersion: PositiveIntegerSchema,
});

export default function SyncPersonPage(props: DynamicPageProps) {
  const params = use(props.params);
  const { procedureId, personVersion, fileStateId } = v.parse(
    RouteParamsSchema,
    params,
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
    <Box role="tabpanel">
      <CentralFileSyncForm
        title={formatPersonName(data.personDetailsDiff.fileState)}
        onAccept={handleSync}
        onCancel={() => router.back()}
      >
        <BasePersonDiffForm diff={data} />
      </CentralFileSyncForm>
    </Box>
  );
}
