/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SvgIcon, SvgIconProps } from "@mui/joy";

export function InactiveChecklistIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg
        width="16"
        height="14"
        viewBox="0 0 16 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 0.333984H14C14.825 0.333984 15.5 1.00065 15.5 1.81547V5.18247H14V1.81547H2V12.1858H7.04545V13.6673H2C1.175 13.6673 0.5 13.0007 0.5 12.1858V1.81547C0.5 1.00065 1.175 0.333984 2 0.333984ZM7.04545 7.74139V6.25991H2.75V7.74139H7.04545ZM7.04545 3.29695H2.75V4.77843H7.04545V3.29695ZM2.75 9.22287H5.81818V10.7044H2.75V9.22287Z"
          fill="#171A1C"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.94752 7.00065L8.75053 8.18286L10.8457 10.2522L8.75031 12.3218L9.94729 13.504L12.0427 11.4344L14.137 13.5028L15.334 12.3206L13.2397 10.2522L15.3337 8.18402L14.1367 7.00181L12.0427 9.06998L9.94752 7.00065Z"
          fill="#171A1C"
        />
      </svg>
    </SvgIcon>
  );
}
