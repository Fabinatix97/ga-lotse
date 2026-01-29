/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import {
  useGetObjectTypeHierarchyTree,
  useGetObjectTypes,
} from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { EditChecklistDefinition } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/EditChecklistDefinition";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function NewChecklist() {
  const { data: objectTypes } = useGetObjectTypes();
  const { data: objectTypeHierarchyTree } = useGetObjectTypeHierarchyTree();
  const featureToggleEnabled = useIsNewFeatureEnabled("OBJECT_TYPE_HIERARCHY");

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
        <EditChecklistDefinition
          objectTypes={
            featureToggleEnabled ? objectTypeHierarchyTree : objectTypes
          }
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
