/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InfoOutlined } from "@mui/icons-material";
import { Stack, Tooltip, Typography } from "@mui/joy";

interface FormSectionTitleProps {
  title: string;
  tooltip: string;
}

export function FormSectionTitle(props: FormSectionTitleProps) {
  return (
    <Stack gap={1} direction="row">
      <Typography level="title-sm">{props.title}</Typography>
      <Tooltip title={props.tooltip} color="success" variant="outlined">
        <InfoOutlined color="primary" size="sm" />
      </Tooltip>
    </Stack>
  );
}
