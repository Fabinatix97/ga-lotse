/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SvgIcon, SvgIconProps } from "@mui/joy";

export function ActiveChecklistIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1.8 0H16.2C17.19 0 18 0.794375 18 1.76528V7.70304H16.2V1.76528H1.8V14.1222H7.85455V15.8875H1.8C0.81 15.8875 0 15.0931 0 14.1222V1.76528C0 0.794375 0.81 0 1.8 0ZM7.85455 8.8264V7.06112H2.7V8.8264H7.85455ZM7.85455 3.53056H2.7V5.29584H7.85455V3.53056ZM2.7 10.5917H6.38182V12.357H2.7V10.5917Z"
          fill="#171A1C"
        />
        <path
          d="M9.63084 12.9633L11.0672 11.5546L14.1637 14.5913L12.7273 16L9.63084 12.9633Z"
          fill="#171A1C"
        />
        <path
          d="M12.7273 16L11.2909 14.5913L16.0934 9.88141L17.5298 11.2901L12.7273 16Z"
          fill="#171A1C"
        />
      </svg>
    </SvgIcon>
  );
}
