/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { styled } from "@mui/joy";
import { forwardRef } from "react";

const VisuallyHiddenContainer = styled("div")({
  display: "none",
});

export const HiddenContainer = forwardRef<HTMLDivElement>(
  function HiddenContainer(props, ref) {
    return <VisuallyHiddenContainer ref={ref} aria-hidden="true" />;
  },
);
