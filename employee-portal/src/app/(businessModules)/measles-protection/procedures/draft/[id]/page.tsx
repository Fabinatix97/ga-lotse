/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import { MeaslesProtectionDetailsRouteParamsSchema } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionDetailsRouteParamsSchema";
import { MeaslesProtectionProcedureDraftClientPage } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionProcedureDraftClientPage";

export default function MeaslesProtectionProcedureDetailsPage(
  props: DynamicPageProps<MeaslesProtectionDetailsRouteParamsSchema>,
) {
  const { id } = use(props.params);

  return <MeaslesProtectionProcedureDraftClientPage id={id} />;
}
