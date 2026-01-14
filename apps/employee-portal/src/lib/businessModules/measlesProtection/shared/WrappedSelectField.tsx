/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";

import { SelectField } from "@eshg/lib-portal";

export const WrappedSelectField = styled(SelectField)(({ theme }) => ({
  ".MuiSelect-root": {
    borderRadius: theme.radius.md,
  },
  ".MuiSelect-listbox": {
    minWidth: theme.spacing(10),
    borderRadius: theme.radius.md,
  },
  ".MuiOption-root": {
    padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
  },
})) as typeof SelectField;
