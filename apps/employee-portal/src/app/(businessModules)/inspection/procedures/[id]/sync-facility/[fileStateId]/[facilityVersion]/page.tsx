/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal";

import { FacilitySyncContent } from "@/lib/businessModules/inspection/components/inspection/common/FacilitySyncContent";

export default async function SyncFacilityPage(
  props: DynamicPageProps<{
    id: string;
    fileStateId: string;
    facilityVersion: string;
  }>,
) {
  const params = await props.params;

  return (
    <FacilitySyncContent
      procedureId={params.id}
      fileStateId={params.fileStateId}
    />
  );
}
