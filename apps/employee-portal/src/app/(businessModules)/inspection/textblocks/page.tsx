/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { GetTextBlocksRequest } from "@eshg/inspection-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { PageProps } from "@eshg/lib-portal";

import { useGetTextBlocks } from "@/lib/businessModules/inspection/api/queries/textblocks";
import { TextBlocksTable } from "@/lib/businessModules/inspection/components/textBlock/TextBlocksTable";

export default function TextBlocksOverviewPage(props: PageProps) {
  const searchParams = use(props.searchParams);
  const request: GetTextBlocksRequest = searchParams;
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
