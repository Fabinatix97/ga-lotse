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

import { useGetChecklistDefinitionVersion } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { ReadOnlyCLDPage } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/ReadOnlyCLDPage";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function ViewChecklistVersion(
  props: DynamicPageProps<{ defId: string; versionId: string }>,
) {
  const { defId, versionId } = use(props.params);

  const { data: checklistVersion } =
    useGetChecklistDefinitionVersion(versionId);

  if (checklistVersion.context.defId !== defId) {
    throw new Error("defId does not match");
  }

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          backHref={routes.checklists.definitions.index}
          title={`Checklistendefinition ansehen: ${checklistVersion.context.name}`}
        />
      }
    >
      <MainContentLayout>
        <ReadOnlyCLDPage cldVersion={checklistVersion} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
