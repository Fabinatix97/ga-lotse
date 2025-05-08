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

import { MeaslesProtectionDetailsRouteParamsSchema } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionDetailsRouteParamsSchema";
import { PersonSyncForm } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/PersonSyncForm";

const RouteParamsSchema = v.object({
  ...MeaslesProtectionDetailsRouteParamsSchema.entries,
  fileStateId: UuidSchema,
  personVersion: PositiveIntegerSchema,
});

export default function SyncAffectedPersonPage(props: DynamicPageProps) {
  const params = use(props.params);
  const { id, fileStateId, personVersion } = v.parse(RouteParamsSchema, params);

  return (
    <PersonSyncForm
      procedureId={id}
      fileStateId={fileStateId}
      personVersion={personVersion}
    />
  );
}
