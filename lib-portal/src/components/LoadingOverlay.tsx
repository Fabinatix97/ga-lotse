/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, BoxProps, styled } from "@mui/joy";

import { LoadingIndicator } from "./LoadingIndicator";

const Backdrop = styled(Box)(({ theme }) => ({
  background: theme.palette.background.backdrop,
  userSelect: "none", // disable interactions
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}));

export function LoadingOverlay(
  props: Pick<BoxProps, "component" | "sx" | "zIndex">,
) {
  return (
    <Backdrop
      component={props.component}
      sx={props.sx}
      zIndex={props.zIndex}
      aria-hidden="true"
    >
      <LoadingIndicator fullHeight />
    </Backdrop>
  );
}
