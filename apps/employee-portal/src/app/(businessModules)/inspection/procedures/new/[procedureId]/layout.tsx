/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal";

import { useGetInspection } from "@/lib/businessModules/inspection/api/queries/inspection";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function NewInspectionLayout(
  props: DynamicLayoutProps<{ procedureId: string }>,
) {
  const { procedureId } = use(props.params);
  const { data: inspection } = useGetInspection(procedureId);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={inspection.facility.baseFacility.name}
          backButton={<ToolbarBackButton href={routes.procedures.index} />}
        />
      }
    >
      <MainContentLayout>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
