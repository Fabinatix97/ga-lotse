/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Theme } from "@mui/joy";

const LIST_ITEM_HEIGHT = 56;
const LIST_ITEM_PADDING = 2;

export function topicMenuItemStyles(theme: Theme) {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(2),
    height: LIST_ITEM_HEIGHT,
    padding: theme.spacing(LIST_ITEM_PADDING),
    borderRadius: 0,
    fontWeight: 700,
    hyphens: "auto",
    overflowWrap: "break-word",
    "&:hover": {
      color: theme.palette.primary.plainColor,
      backgroundColor: theme.palette.neutral.plainHoverBg,
    },
    "&[aria-current='true'], &[aria-current='page']": {
      color: theme.palette.primary.plainColor,
    },
  } as const;
}
