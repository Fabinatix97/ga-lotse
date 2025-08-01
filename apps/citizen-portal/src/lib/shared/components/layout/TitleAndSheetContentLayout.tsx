/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { PropsWithChildren } from "react";

import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

import { PageContent } from "./PageContent";
import { PageTitle } from "./page";

export function TitleAndSheetContentLayout(
  props: PropsWithChildren<{ pageTitle: string }>,
) {
  return (
    <PageContent>
      <PageTitle>{props.pageTitle}</PageTitle>
      <GridColumnStack>
        <ContentSheet>{props.children}</ContentSheet>
      </GridColumnStack>
    </PageContent>
  );
}
