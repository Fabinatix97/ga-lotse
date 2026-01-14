/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SxProps } from "@mui/joy/styles/types";

export function multiLineEllipsis(linesToShow = 2) {
  return {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: linesToShow,
    lineClamp: String(linesToShow),
    overflow: "hidden",
    textOverflow: "ellipsis",
  } satisfies SxProps;
}
