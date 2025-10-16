/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { JSX } from "react";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { Markdown, defaultComponents } from "@eshg/lib-portal";

import { StaticTextDocumentPanel } from "@/lib/baseModule/components/StaticTextDocumentPanel";

export function MarkdownPage({
  title,
  source,
  footer,
}: {
  title: string;
  source: string;
  footer?: JSX.Element;
}) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={title} />}>
      <MainContentLayout>
        <StaticTextDocumentPanel>
          <Markdown
            components={defaultComponents}
            source={source}
            footer={footer}
          />
        </StaticTextDocumentPanel>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
