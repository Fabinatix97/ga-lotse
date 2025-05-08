/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import * as v from "valibot";

import {
  BaseFacilityDiffForm,
  CentralFileSyncForm,
  useGetFacilityFileStateDiff,
} from "@eshg/lib-employee-portal";
import { formatFacilityName } from "@eshg/lib-portal/formatters/facility";
import {
  PositiveIntegerSchema,
  UuidSchema,
} from "@eshg/lib-portal/schemas/pageParams";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { useSyncFacility } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { OfficialMedicalServiceDetailsRouteParamsSchema } from "@/lib/businessModules/officialMedicalService/components/procedures/details/OfficialMedicalServiceDetailsRouteParamsSchema";

const RouteParamsSchema = v.object({
  ...OfficialMedicalServiceDetailsRouteParamsSchema.entries,
  fileStateId: UuidSchema,
  facilityVersion: PositiveIntegerSchema,
});

export default function SyncFacilityPage(props: DynamicPageProps) {
  const params = use(props.params);
  const { id, fileStateId, facilityVersion } = v.parse(
    RouteParamsSchema,
    params,
  );
  const router = useRouter();
  const { data } = useGetFacilityFileStateDiff(fileStateId);
  const syncFacility = useSyncFacility(id);

  async function handleSync() {
    await syncFacility.mutateAsync(
      {
        referenceVersion: data.referenceVersion,
        facilityVersion,
        fileStateId,
      },
      {
        onSuccess: () => router.back(),
      },
    );
  }

  return (
    <CentralFileSyncForm
      title={formatFacilityName(data.facilityDetailsDiff.fileState)}
      onAccept={handleSync}
      onCancel={() => router.back()}
    >
      <BaseFacilityDiffForm diff={data} />
    </CentralFileSyncForm>
  );
}
