/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { useGetObjectTypes } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { EditChecklistDefinition } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/EditChecklistDefinition";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function NewChecklist() {
  const { data: objectTypes } = useGetObjectTypes();

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          backHref={routes.checklists.definitions.index}
          title="Checkliste erstellen"
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <EditChecklistDefinition objectTypes={objectTypes} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
