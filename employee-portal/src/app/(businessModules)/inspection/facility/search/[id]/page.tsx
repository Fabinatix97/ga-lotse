/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { use } from "react";

import { useGetWebSearchById } from "@/lib/businessModules/inspection/api/queries/webSearch";
import { FacilityWebSearchForm } from "@/lib/businessModules/inspection/components/facility/search/FacilityWebSearchForm";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function EditFacilityWebSearchPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const { data: webSearch } = useGetWebSearchById(id);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`Web-Suche: ${webSearch.name}`}
          backButton={
            <ToolbarBackButton href={routes.facilities.webSearch.index} />
          }
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <FacilityWebSearchForm initialValues={webSearch} id={id} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
