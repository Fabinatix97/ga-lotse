/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";
import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { ApiAdminActorMetadata } from "@eshg/service-directory-api";

import { EmptyCell } from "@/lib/components/table/cell/EmptyCell";

// based on https://dev.to/gauravadhikari1997/show-json-as-pretty-print-with-syntax-highlighting-3jpm
function syntaxHighlight(json: string) {
  if (!json) return ""; //no JSON from response

  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "number";
      if (match.startsWith('"')) {
        if (match.endsWith(":")) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (match.includes("null")) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    },
  );
}

export function MetadataCell<TData>(
  props: CellContext<TData, ApiAdminActorMetadata>,
): ReactNode {
  const content = props.getValue()?.content;
  if (content) {
    return (
      <SPre
        dangerouslySetInnerHTML={{ __html: syntaxHighlight(content) }}
      ></SPre>
    );
  } else {
    return <EmptyCell />;
  }
}
const SPre = styled("pre")({
  outline: "false",
  margin: "0px",
  "& .string": {
    color: "green",
  },
  "& .number": {
    color: "darkorange",
  },
  "& .boolean": {
    color: "blue",
  },
  "& .null": {
    color: "magenta",
  },
  "& .key": {
    color: "red",
  },
});
