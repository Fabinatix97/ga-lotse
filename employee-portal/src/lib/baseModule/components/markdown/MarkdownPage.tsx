/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { evaluate } from "@mdx-js/mdx";
import { List, ListItem, Typography } from "@mui/joy";
import { promises as fs } from "fs";
import * as path from "path";
import { HTMLProps } from "react";
import * as runtime from "react/jsx-runtime";
import "server-only";

import { env } from "@/env/server";

const mdxComponents = {
  a: (props: HTMLProps<HTMLAnchorElement>) => (
    <ExternalLink href={props.href} target="_blank">
      {props.children}
    </ExternalLink>
  ),
  p: (props: HTMLProps<HTMLParagraphElement>) => (
    <Typography component="p">{props.children}</Typography>
  ),
  span: (props: HTMLProps<HTMLSpanElement>) => (
    <Typography component="span">{props.children}</Typography>
  ),
  h2: (props: HTMLProps<HTMLHeadingElement>) => (
    <Typography level="h2">{props.children}</Typography>
  ),
  h3: (props: HTMLProps<HTMLHeadingElement>) => (
    <Typography level="h3">{props.children}</Typography>
  ),
  h4: (props: HTMLProps<HTMLHeadingElement>) => (
    <Typography component="p" level="title-md">
      {props.children}
    </Typography>
  ),
  ul: (props: HTMLProps<HTMLUListElement>) => (
    <List marker="disc">{props.children}</List>
  ),
  li: (props: HTMLProps<HTMLLIElement>) => (
    <ListItem>{props.children}</ListItem>
  ),
};

export type PageName =
  | "contact"
  | "accessibility"
  | "privacy"
  | "release-notes";
const validPageTypes: string[] = [
  "contact",
  "accessibility",
  "privacy",
  "release-notes",
] as const satisfies PageName[];

export function isValidPageType(type: string): type is PageName {
  return validPageTypes.includes(type);
}

export async function MarkdownPage({ pageType }: { pageType: PageName }) {
  const filePath = path.join(
    process.cwd(),
    "markdown",
    pageType === "release-notes" ? "common" : env.MARKDOWN_PAGE_DIRECTORY,
    `${pageType}.md`,
  );

  const source = await fs.readFile(filePath, { encoding: "utf-8" });

  const { default: MDXContent } = await evaluate(source, {
    ...runtime,
    format: "md",
  });

  return <MDXContent components={mdxComponents} />;
}
