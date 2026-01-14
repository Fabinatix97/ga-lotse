/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SxProps } from "@mui/joy/styles/types";

export const BOOLEAN_SELECT_STYLE: SxProps = {
  "--FormLabel-margin": "0 16px 0 0",
  ".MuiSelect-root": { width: "90px" },
};

export const FIXED_WIDTH_BOOLEAN_SELECT_STYLE: SxProps = {
  ...BOOLEAN_SELECT_STYLE,
  width: "240px",
};

export const BOLD_LABEL_STYLE = {
  "& label": {
    fontWeight: "bold",
  },
};

export const BOOLEAN_WITH_UNKNOWN_STYLE: SxProps = {
  ".MuiSelect-root": { width: "145px" },
};
