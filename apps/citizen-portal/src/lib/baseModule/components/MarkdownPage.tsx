/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { Markdown, defaultComponents } from "@eshg/lib-portal";

import { TitleAndSheetContentLayout } from "@/lib/shared/components/layout/TitleAndSheetContentLayout";

const components: typeof defaultComponents = {
  ...defaultComponents,
  h2: (props) => (
    <Typography component="h2" level="h3">
      {props.children}
    </Typography>
  ),
  h3: (props) => (
    <Typography component="h3" level="title-md">
      {props.children}
    </Typography>
  ),
};

export function MarkdownPage({
  title,
  source,
}: {
  title: string;
  source: string;
}) {
  return (
    <TitleAndSheetContentLayout pageTitle={title}>
      <Markdown components={components} source={source} />
    </TitleAndSheetContentLayout>
  );
}
