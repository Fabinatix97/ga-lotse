/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useChecklistDefinitionApi,
  useObjectTypeApi,
} from "@/lib/businessModules/inspection/api/clients";
import { getChecklistDefinitionVersionQuery } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { getObjectTypesQuery } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { EditChecklistDefinition } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/EditChecklistDefinition";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function NewChecklistVersion({
  params: { defId, versionId },
}: Readonly<{
  params: { defId: string; versionId: string };
}>) {
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
