/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import { useGetObjectTypes } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { EditChecklistDefinition } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/EditChecklistDefinition";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function NewChecklist() {
  const { data: objectTypes } = useGetObjectTypes();

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Checkliste erstellen"
          backButton={
            <ToolbarBackButton href={routes.checklists.definitions.index} />
          }
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <EditChecklistDefinition objectTypes={objectTypes} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
