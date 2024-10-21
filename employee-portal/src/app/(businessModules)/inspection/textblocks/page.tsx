/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { GetTextBlocksRequest } from "@eshg/employee-portal-api/inspection";

import { useGetTextBlocks } from "@/lib/businessModules/inspection/api/queries/textblocks";
import { TextBlocksTable } from "@/lib/businessModules/inspection/components/textBlock/TextBlocksTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { SearchParams } from "@/lib/shared/helpers/searchParams";

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
