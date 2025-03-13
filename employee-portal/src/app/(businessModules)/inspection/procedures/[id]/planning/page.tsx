/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { InspectionTabPlanning } from "@/lib/businessModules/inspection/components/inspection/planning/InspectionTabPlanning";

export default function InspectionTabPlanningPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = props.params;

  return <InspectionTabPlanning inspectionId={id} />;
}
