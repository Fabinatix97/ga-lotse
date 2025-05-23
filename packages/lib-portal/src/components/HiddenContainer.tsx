/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { styled } from "@mui/joy";
import { HTMLAttributes } from "react";

const VisuallyHiddenContainer = styled("div")({
  display: "none",
});

export function HiddenContainer({
  id,
}: Pick<HTMLAttributes<HTMLDivElement>, "id">) {
  return <VisuallyHiddenContainer id={id} aria-hidden="true" />;
}
