/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Typography, TypographyProps } from "@mui/joy";

export function SidePanelTitle(props: Omit<TypographyProps, "level">) {
  return <Typography component="h2" {...props} level="title-md" />;
}
