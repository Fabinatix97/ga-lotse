/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SvgIconComponent } from "@mui/icons-material";
import { SvgIconProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { createElement } from "react";

interface GradientIconProps extends Omit<SvgIconProps, "style"> {
  iconClass: SvgIconComponent;
  sx?: SxProps;
}

export function GradientIcon({ iconClass, ...props }: GradientIconProps) {
  const iconProps = { ...props, sx: { fill: "url(#gradient)", ...props.sx } };
  const icon = createElement(iconClass, iconProps);

  return (
    <>
      <svg width={0} height={0}>
        <linearGradient id="gradient" x1={1} y1={0} x2={1} y2={1}>
          <stop offset={0} stopColor="#1400FF" stopOpacity={0.54} />
          <stop offset={1} stopColor="#1CA2EE" stopOpacity={0.54} />
        </linearGradient>
      </svg>
      {icon}
    </>
  );
}
