/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetWebSearchById } from "@/lib/businessModules/inspection/api/queries/webSearch";
import { FacilityWebSearchForm } from "@/lib/businessModules/inspection/components/facility/search/FacilityWebSearchForm";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

type EditFacilityPageProps = Readonly<{
  params: { id: string };
}>;

export default function EditFacilityWebSearchPage({
  params: { id },
}: EditFacilityPageProps) {
  const { data: webSearch } = useGetWebSearchById(id);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          backHref={routes.facilities.webSearch.index}
          title={`Web-Suche: ${webSearch.name}`}
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <FacilityWebSearchForm initialValues={webSearch} id={id} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
