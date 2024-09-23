/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { PropsWithChildren } from "react";

import { PageBanner } from "@/lib/baseModule/components/layout/PageBanner";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";
import { Page, PageTitle } from "@/lib/shared/components/layout/page";

export function TitleAndSheetContentLayout(
  props: PropsWithChildren<{ pageTitle: string }>,
) {
  return (
    <Page>
      <PageBanner />
      <PageTitle>{props.pageTitle}</PageTitle>
      <GridColumnStack>
        <ContentSheet>{props.children}</ContentSheet>
      </GridColumnStack>
    </Page>
  );
}
