/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import NotFound from "@/app/not-found";
import { StaticTextDocumentPanel } from "@/lib/baseModule/components/StaticTextDocumentPanel";
import {
  MarkdownPage,
  PageName,
  isValidPageType,
} from "@/lib/baseModule/components/markdown/MarkdownPage";

const title = {
  contact: "Kontakt",
  accessibility: "Erklärung zur Barrierefreiheit",
  privacy: "Datenschutzerklärung",
  "release-notes": "Release Notes",
} as const satisfies Record<PageName, string>;

export default async function StaticDocumentPage(
  props: DynamicPageProps<{
    documentType: string;
  }>,
) {
  const { documentType } = await props.params;
  if (!isValidPageType(documentType)) {
    return <NotFound />;
  }

  return (
    <StickyToolbarLayout toolbar={<Toolbar title={title[documentType]} />}>
      <MainContentLayout>
        <StaticTextDocumentPanel>
          <MarkdownPage pageType={documentType} />
        </StaticTextDocumentPanel>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
