/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal";

import { InspectionTabBasedata } from "@/lib/businessModules/inspection/components/inspection/basedata/InspectionTabBasedata";

export default async function InspectionTabBasedataPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = await props.params;

  return <InspectionTabBasedata inspectionId={id} />;
}
