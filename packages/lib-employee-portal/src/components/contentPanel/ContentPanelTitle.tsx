/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InfoOutlined } from "@mui/icons-material";
import { Stack, Tooltip, Typography, TypographyProps } from "@mui/joy";
import { useId } from "react";
import { isDefined } from "remeda";

interface ContentPanelTitleProps extends Omit<TypographyProps, "level"> {
  tooltip?: string;
}

export function ContentPanelTitle(props: ContentPanelTitleProps) {
  const tooltipId = useId();
  const { tooltip, ...typographyProps } = props;

  return (
    <Stack gap={1} direction="row">
      <Typography
        component="h1"
        {...typographyProps}
        level="title-lg"
        aria-describedby={tooltipId}
      />
      {isDefined(tooltip) && (
        <Tooltip
          id={tooltipId}
          title={tooltip}
          color="success"
          variant="outlined"
          keepMounted
        >
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
