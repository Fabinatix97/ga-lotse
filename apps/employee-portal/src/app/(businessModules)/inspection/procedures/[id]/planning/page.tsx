/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal";

import { InspectionTabPlanning } from "@/lib/businessModules/inspection/components/inspection/planning/InspectionTabPlanning";

export default async function InspectionTabPlanningPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = await props.params;

  return <InspectionTabPlanning inspectionId={id} />;
}
