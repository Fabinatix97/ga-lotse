/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";
import * as v from "valibot";

import {
  PositiveIntegerSchema,
  UuidSchema,
} from "@eshg/lib-portal/schemas/pageParams";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { CustodianSyncForm } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/CustodianSyncForm";
import { MeaslesProtectionDetailsRouteParamsSchema } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionDetailsRouteParamsSchema";

const RouteParamsSchema = v.object({
  ...MeaslesProtectionDetailsRouteParamsSchema.entries,
  custodianId: UuidSchema,
  fileStateId: UuidSchema,
  custodianVersion: PositiveIntegerSchema,
});

export default function SyncCustodianPage(props: DynamicPageProps) {
  const params = use(props.params);
  const { id, custodianId, fileStateId, custodianVersion } = v.parse(
    RouteParamsSchema,
    params,
  );

  return (
    <CustodianSyncForm
      procedureId={id}
      custodianId={custodianId}
      fileStateId={fileStateId}
      custodianVersion={custodianVersion}
    />
  );
}
