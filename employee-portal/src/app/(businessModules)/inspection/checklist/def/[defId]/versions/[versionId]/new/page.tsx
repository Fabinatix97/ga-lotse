/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import {
  useChecklistDefinitionApi,
  useObjectTypeApi,
} from "@/lib/businessModules/inspection/api/clients";
import { getChecklistDefinitionVersionQuery } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { getObjectTypesQuery } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { EditChecklistDefinition } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/EditChecklistDefinition";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function NewChecklistVersion(
  props: DynamicPageProps<{ defId: string; versionId: string }>,
) {
  const { defId, versionId } = use(props.params);

  const objectTypeApi = useObjectTypeApi();
  const checklistDefinitionApi = useChecklistDefinitionApi();

  const [{ data: objectTypes }, { data: checklistVersion }] =
    useSuspenseQueries({
      queries: [
        getObjectTypesQuery(objectTypeApi),
        getChecklistDefinitionVersionQuery(checklistDefinitionApi, versionId),
      ],
    });

  if (checklistVersion.context.defId !== defId) {
    throw new Error("defId does not match");
  }

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          backHref={routes.checklists.definitions.index}
          title={`Checklistendefinition bearbeiten: ${checklistVersion.context.name}`}
        />
      }
    >
      <MainContentLayout>
        <EditChecklistDefinition
          cldVersion={checklistVersion}
          objectTypes={objectTypes}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
