/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { evaluate } from "@mdx-js/mdx";
import { List, ListItem, Typography } from "@mui/joy";
import { promises as fs } from "fs";
import path from "path";
import * as runtime from "react/jsx-runtime";
import "server-only";

import { env } from "@/env/server";
import { TitleAndSheetContentLayout } from "@/lib/shared/components/layout/TitleAndSheetContentLayout";

export async function MarkdownPage({
  pageType,
  title,
}: {
  pageType: "imprint" | "accessibility" | "privacy" | "opendata";
  title: string;
}) {
  const filePath = path.join(
    process.cwd(),
    "markdown",
    env.MARKDOWN_PAGE_DIRECTORY,
    `${pageType}.md`,
  );

  const source = await fs.readFile(filePath, { encoding: "utf-8" });

  const { default: MDXContent } = await evaluate(source, {
    ...runtime,
    format: "md",
  });

  return (
    <TitleAndSheetContentLayout pageTitle={title}>
      <MDXContent
        components={{
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
          p: (props) => <Typography component="p">{props.children}</Typography>,
          span: (props) => (
            <Typography component="span">{props.children}</Typography>
          ),
          a: (props) => (
            <ExternalLink href={props.href} target="_blank">
              {props.children}
            </ExternalLink>
          ),
          ul: (props) => <List marker="disc">{props.children}</List>,
          li: (props) => <ListItem>{props.children}</ListItem>,
        }}
      />
    </TitleAndSheetContentLayout>
  );
}
