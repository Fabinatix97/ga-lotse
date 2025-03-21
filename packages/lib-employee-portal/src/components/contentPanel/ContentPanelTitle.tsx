/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InfoOutlined } from "@mui/icons-material";
import { Stack, Tooltip, Typography, TypographyProps } from "@mui/joy";
import { isDefined } from "remeda";

interface ContentPanelTitleProps extends Omit<TypographyProps, "level"> {
  tooltip?: string;
}

export function ContentPanelTitle(props: ContentPanelTitleProps) {
  return (
    <Stack gap={1} direction="row">
      <Typography component="h1" {...props} level="title-lg" />
      {isDefined(props.tooltip) && (
        <Tooltip title={props.tooltip} color="success" variant="outlined">
          <InfoOutlined
            color="primary"
            size="sm"
            sx={{ marginTop: "auto", marginBottom: "auto" }}
          />
        </Tooltip>
      )}
    </Stack>
  );
}
