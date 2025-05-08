/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import {
  Markdown,
  defaultComponents,
} from "@eshg/lib-portal/components/Markdown";

import { StaticTextDocumentPanel } from "@/lib/baseModule/components/StaticTextDocumentPanel";

export function MarkdownPage({
  title,
  source,
}: {
  title: string;
  source: string;
}) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={title} />}>
      <MainContentLayout>
        <StaticTextDocumentPanel>
          <Markdown components={defaultComponents} source={source} />
        </StaticTextDocumentPanel>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
