/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useChecklistDefinitionApi,
  useObjectTypeApi,
} from "@/lib/businessModules/inspection/api/clients";
import { getChecklistDefinitionVersionQuery } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { getObjectTypesQuery } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { EditChecklistDefinition } from "@/lib/businessModules/inspection/components/checklistDefinition/EditChecklistDefinition";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

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

  const canWrite = useHasUserRoleCheck(
    ApiUserRole.InspectionChecklistdefinitionsWrite,
  );

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
          readonly={!canWrite}
          objectTypes={objectTypes}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
