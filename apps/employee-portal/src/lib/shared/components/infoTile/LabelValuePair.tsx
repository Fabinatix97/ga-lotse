/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Stack, Typography } from "@mui/joy";
import { ReactElement } from "react";

import { RequiresChildren } from "@eshg/lib-portal";

export function StyledValue(props: RequiresChildren) {
  return (
    <Typography flex={1} level="title-md" role="definition">
      {props.children}
    </Typography>
  );
}

export function LabelValuePair(props: {
  label: string;
  value: string | ReactElement;
}) {
  return (
    <Stack direction="row" gap={1}>
      <Typography flex={1} level="body-md" role="term">
        {props.label}
      </Typography>
      {typeof props.value === "string" ? (
        <StyledValue>{props.value}</StyledValue>
      ) : (
        <Box flex={1}>{props.value}</Box>
      )}
    </Stack>
  );
}
