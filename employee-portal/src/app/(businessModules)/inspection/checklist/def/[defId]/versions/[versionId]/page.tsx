/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { useGetChecklistDefinitionVersion } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { ReadOnlyCLDPage } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/ReadOnlyCLDPage";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function ViewChecklistVersion({
  params: { defId, versionId },
}: Readonly<{
  params: { defId: string; versionId: string };
}>) {
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
