/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { GetTextBlocksRequest } from "@eshg/inspection-api";
import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import { SearchParams } from "@eshg/lib-portal/helpers/searchParams";

import { useGetTextBlocks } from "@/lib/businessModules/inspection/api/queries/textblocks";
import { TextBlocksTable } from "@/lib/businessModules/inspection/components/textBlock/TextBlocksTable";

export default function TextBlocksOverviewPage(props: {
  searchParams: SearchParams;
}) {
  const request: GetTextBlocksRequest = props.searchParams;
  const {
    data: { elements, totalNumberOfElements },
    isFetching,
  } = useGetTextBlocks(request);

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Textbausteine" />}>
      <MainContentLayout fullViewportHeight>
        <TextBlocksTable
          elements={elements}
          totalNumberOfElements={totalNumberOfElements}
          isFetching={isFetching}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
