/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { getInspectionQuery } from "@/lib/businessModules/inspection/api/queries/inspection";
import { FacilitySyncContent } from "@/lib/businessModules/inspection/components/inspection/common/FacilitySyncContent";

export default function SyncFacilityPage(
  props: DynamicPageProps<{
    procedureId: string;
    fileStateId: string;
    facilityVersion: string;
  }>,
) {
  const params = use(props.params);
  const inspectionApi = useInspectionApi();

  const [{ data: inspection }] = useSuspenseQueries({
    queries: [getInspectionQuery(inspectionApi, params.procedureId)],
  });

  return (
    <FacilitySyncContent
      procedureId={params.procedureId}
      fileStateId={params.fileStateId}
      fileNumber={inspection.facility.fileNumber}
      procedureStatus={inspection.status}
    />
  );
}
