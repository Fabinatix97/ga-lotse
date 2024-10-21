/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import NotFound from "@/app/not-found";
import { StaticTextDocumentPanel } from "@/lib/baseModule/components/StaticTextDocumentPanel";
import {
  MarkdownPage,
  PageName,
  isValidPageType,
} from "@/lib/baseModule/components/markdown/MarkdownPage";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
