/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetChecklistDefinitionVersion } from "@/lib/businessModules/inspection/api/queries/checklistDefinition";
import { ReadOnlyCLDPage } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/ReadOnlyCLDPage";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
