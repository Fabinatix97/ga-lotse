/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { CircularProgress, Stack, StackProps, Typography } from "@mui/joy";
import { forwardRef, useId } from "react";

const DEFAULT_TEXT = "Wird geladen…";

export interface LoadingIndicatorProps
  extends Omit<StackProps, "gap" | "alignItems" | "justifyContent"> {
  text?: string;
  fullHeight?: boolean;
}

export const LoadingIndicator = forwardRef<
  HTMLDivElement,
  LoadingIndicatorProps
>(function LoadingIndicator(props: LoadingIndicatorProps, ref) {
  const { text, fullHeight, ...stackProps } = props;
  const height = fullHeight ? "100%" : undefined;
  const typographyId = useId();

  return (
    <Stack
      gap={1}
      alignItems="center"
      justifyContent="center"
      height={height}
      {...stackProps}
      ref={ref}
    >
      <CircularProgress aria-labelledby={typographyId} />
      <Typography id={typographyId}>{text ?? DEFAULT_TEXT}</Typography>
    </Stack>
  );
});
