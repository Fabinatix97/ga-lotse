/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

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

export default function StaticDocumentPage({
  params,
}: Readonly<{
  params: { documentType: string };
}>) {
  const documentType = params.documentType;
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
