/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { List, ListItem, Typography } from "@mui/joy";
import ReactMarkdown, { Components } from "react-markdown";

import { ExternalLink } from "./navigation/ExternalLink";

export const defaultComponents: Components = {
  h2: (props) => (
    <Typography component="h2" level="h2">
      {props.children}
    </Typography>
  ),
  h3: (props) => (
    <Typography component="h3" level="h3">
      {props.children}
    </Typography>
  ),
  p: (props) => <Typography component="p">{props.children}</Typography>,
  a: (props) => (
    <ExternalLink href={props.href} target="_blank">
      {props.children}
    </ExternalLink>
  ),
  ul: (props) => <List marker="disc">{props.children}</List>,
  li: (props) => <ListItem>{props.children}</ListItem>,
};

// This is a list of allowed elements that can be rendered by the Markdown component.
// Some elements are not allowed for security reasons.
// For example, <img> elements will not be rendered.
const allowedElements = [
  "a",
  "br",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "ol",
  "p",
  "strong",
  "ul",
];

export function Markdown({
  components,
  source,
}: {
  components?: Components;
  source: string;
}) {
  return (
    // Please note that this component is used to render markdown content on the client side.
    // It is important to carefully configure this component to keep things secure.
    // Please double check any changes and contact the security team if in doubt.
    <ReactMarkdown components={components} allowedElements={allowedElements}>
      {source}
    </ReactMarkdown>
  );
}
