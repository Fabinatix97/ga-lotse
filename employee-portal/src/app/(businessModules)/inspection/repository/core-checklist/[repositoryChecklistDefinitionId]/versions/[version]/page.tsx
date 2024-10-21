/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useChecklistDefinitionCentralRepoApi,
  useObjectTypeApi,
} from "@/lib/businessModules/inspection/api/clients";
import { getChecklistDefinitionFromCentralRepoQuery } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { getObjectTypesQuery } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { EditChecklistDefinition } from "@/lib/businessModules/inspection/components/checklistDefinition/EditChecklistDefinition";
import { RepoChecklistDefinitionHeaderRow } from "@/lib/businessModules/inspection/components/repository/RepoChecklistDefinitionHeaderRow";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function InspectionRepositoryPage({
  params,
}: Readonly<{
  params: { repositoryChecklistDefinitionId: string; version: string };
}>) {
  const repoCldId = parseInt(params.repositoryChecklistDefinitionId);
  const repoVersion = parseInt(params.version);

  const repoApi = useChecklistDefinitionCentralRepoApi();
  const objectTypeApi = useObjectTypeApi();

  const [
    {
      data: { checklistDefinition, ...metadata },
    },
    { data: objectTypes },
  ] = useSuspenseQueries({
    queries: [
      getChecklistDefinitionFromCentralRepoQuery(
        repoApi,
        repoCldId,
        repoVersion,
        true,
      ),
      getObjectTypesQuery(objectTypeApi),
    ],
  });

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          backHref={routes.repository.index}
          title={`Checklistendefinition aus Datenaustausch ansehen: ${checklistDefinition?.name ?? ""}`}
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <EditChecklistDefinition
          cldVersion={checklistDefinition.versions[0]}
          readonly
          headerRow={
            <RepoChecklistDefinitionHeaderRow
              repositoryChecklistDefinitionId={repoCldId}
              centralRepoVersion={repoVersion}
              isCoreChecklist={true}
              version={checklistDefinition.versions[0]!}
              metadata={metadata}
            />
          }
          objectTypes={objectTypes}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
