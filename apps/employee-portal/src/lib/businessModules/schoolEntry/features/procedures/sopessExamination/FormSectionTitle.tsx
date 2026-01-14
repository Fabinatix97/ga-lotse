/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";

import { InfoIconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";

interface FormSectionTitleProps {
  title: string;
  tooltip: string;
  id?: string;
}

export function FormSectionTitle(props: FormSectionTitleProps) {
  return (
    <Stack gap={1} direction="row" alignItems="center">
      <Typography level="title-sm" component="h2" id={props.id}>
        {props.title}
      </Typography>
      <Typography component="span" sx={visuallyHidden}>
        {props.tooltip}
      </Typography>
      <InfoIconTooltipButton
        title={`Hinweis ${props.title}`}
        infoText={props.tooltip}
        tooltipColor="success"
      />
    </Stack>
  );
}
