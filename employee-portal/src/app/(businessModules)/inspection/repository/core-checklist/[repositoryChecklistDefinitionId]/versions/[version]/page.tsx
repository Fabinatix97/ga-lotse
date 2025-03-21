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
import { use } from "react";

import { useGetChecklistDefinitionFromCentralRepo } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { ReadOnlyCLDPage } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/ReadOnlyCLDPage";
import { RepoCLDInfoCard } from "@/lib/businessModules/inspection/components/repository/RepoCLDInfoCard";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function InspectionRepositoryPage(
  props: DynamicPageProps<{
    repositoryChecklistDefinitionId: string;
    version: string;
  }>,
) {
  const { repositoryChecklistDefinitionId, version } = use(props.params);
  const repoCldId = parseInt(repositoryChecklistDefinitionId);
  const repoVersion = parseInt(version);

  const {
    data: { checklistDefinition, ...metadata },
  } = useGetChecklistDefinitionFromCentralRepo(repoCldId, repoVersion, true);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          backHref={routes.repository.index}
          title={`Checklistendefinition aus Datenaustausch ansehen: ${checklistDefinition?.name ?? ""}`}
        />
      }
    >
      <MainContentLayout>
        <ReadOnlyCLDPage
          cldVersion={checklistDefinition.versions[0]!}
          infoCard={
            <RepoCLDInfoCard
              centralRepoId={repoCldId}
              centralRepoVersion={repoVersion}
              isCoreChecklist={true}
              cldVersion={checklistDefinition.versions[0]!}
              metadata={metadata}
            />
          }
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
