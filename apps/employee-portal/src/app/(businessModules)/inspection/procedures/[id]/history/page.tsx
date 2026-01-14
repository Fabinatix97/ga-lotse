/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import { InspectionTabHistory } from "@/lib/businessModules/inspection/components/inspection/history/InspectionTabHistory";

export default function InspectionTabHistoryPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);

  return <InspectionTabHistory inspectionId={id} />;
}
