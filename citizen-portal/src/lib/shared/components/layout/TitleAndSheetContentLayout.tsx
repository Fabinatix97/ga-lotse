/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { PropsWithChildren } from "react";

import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

import { PageContent } from "./PageContent";
import { PageLayout, PageTitle } from "./page";

export function TitleAndSheetContentLayout(
  props: PropsWithChildren<{ pageTitle: string }>,
) {
  return (
    <PageLayout>
      <PageContent>
        <PageTitle>{props.pageTitle}</PageTitle>
        <GridColumnStack>
          <ContentSheet>{props.children}</ContentSheet>
        </GridColumnStack>
      </PageContent>
    </PageLayout>
  );
}
