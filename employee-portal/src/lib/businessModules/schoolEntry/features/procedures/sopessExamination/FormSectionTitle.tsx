/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { InfoIconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";

interface FormSectionTitleProps {
  title: string;
  tooltip: string;
}

export function FormSectionTitle(props: FormSectionTitleProps) {
  return (
    <Stack gap={1} direction="row" alignItems="center">
      <Typography level="title-sm">{props.title}</Typography>
      <InfoIconTooltipButton title={props.tooltip} tooltipColor="success" />
    </Stack>
  );
}
