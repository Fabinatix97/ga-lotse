/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem } from "@mui/joy";

import { Markdown, defaultComponents } from "@eshg/lib-portal";

import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

const components: typeof defaultComponents = {
  ...defaultComponents,
  ul: (props) => (
    <List
      marker="disc"
      sx={{
        "--List-gap:": "0.5px",
        "--ListItem-minHeight:": 0,
        "--ListItem-paddingY:": 0,
        "--ListDivider-gap:": 0,
        "--ListItem-paddingLeft:": 0,
      }}
    >
      {props.children}
    </List>
  ),
  li: (props) => <ListItem>{props.children}</ListItem>,
};

export function MarkdownSheet({
  title,
  source,
}: {
  title: string;
  source: string;
}) {
  return (
    <ContentSheet>
      <ContentSheetTitle>{title}</ContentSheetTitle>
      <Markdown components={components} source={source} />
    </ContentSheet>
  );
}
