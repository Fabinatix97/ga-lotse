/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";

import {
  useChecklistDefinitionApi,
  useObjectTypeApi,
} from "@/lib/businessModules/inspection/api/clients";
import { getChecklistDefinitionVersionQuery } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import {
  getObjectTypesHierarchyTreeQuery,
  getObjectTypesQuery,
} from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { EditChecklistDefinition } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/EditChecklistDefinition";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function NewChecklistVersion(
  props: DynamicPageProps<{ defId: string; versionId: string }>,
) {
  const { defId, versionId } = use(props.params);

  const objectTypeApi = useObjectTypeApi();
  const checklistDefinitionApi = useChecklistDefinitionApi();
  const featureToggleEnabled = useIsNewFeatureEnabled("OBJECT_TYPE_HIERARCHY");

  const [
    { data: objectTypes },
    { data: checklistVersion },
    { data: objectTypesHierarchyTree },
  ] = useSuspenseQueries({
    queries: [
      getObjectTypesQuery(objectTypeApi),
      getChecklistDefinitionVersionQuery(checklistDefinitionApi, versionId),
      getObjectTypesHierarchyTreeQuery(objectTypeApi),
    ],
  });

  if (checklistVersion.context.defId !== defId) {
    throw new Error("defId does not match");
  }

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`Checklistendefinition bearbeiten: ${checklistVersion.context.name}`}
          backButton={
            <ToolbarBackButton href={routes.checklists.definitions.index} />
          }
        />
      }
    >
      <MainContentLayout>
        <EditChecklistDefinition
          cldVersion={checklistVersion}
          objectTypes={
            featureToggleEnabled ? objectTypesHierarchyTree : objectTypes
          }
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
