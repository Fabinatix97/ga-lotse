/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { InspectionTabBasedata } from "@/lib/businessModules/inspection/components/inspection/basedata/InspectionTabBasedata";

export default function InspectionTabBasedataPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = props.params;

  return <InspectionTabBasedata inspectionId={id} />;
}
