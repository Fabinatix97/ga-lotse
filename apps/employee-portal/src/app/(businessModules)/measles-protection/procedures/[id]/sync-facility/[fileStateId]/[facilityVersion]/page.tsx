/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";
import * as v from "valibot";

import { DynamicPageProps } from "@eshg/lib-portal";
import { PositiveIntegerSchema, UuidSchema } from "@eshg/lib-portal/universal";

import { FacilitySyncForm } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/FacilitySyncForm";
import { MeaslesProtectionDetailsRouteParamsSchema } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionDetailsRouteParamsSchema";

const RouteParamsSchema = v.object({
  ...MeaslesProtectionDetailsRouteParamsSchema.entries,
  fileStateId: UuidSchema,
  facilityVersion: PositiveIntegerSchema,
});

export default function SyncFacilityPage(props: DynamicPageProps) {
  const params = use(props.params);
  const { id, fileStateId, facilityVersion } = v.parse(
    RouteParamsSchema,
    params,
  );

  return (
    <FacilitySyncForm
      procedureId={id}
      fileStateId={fileStateId}
      facilityVersion={facilityVersion}
    />
  );
}
