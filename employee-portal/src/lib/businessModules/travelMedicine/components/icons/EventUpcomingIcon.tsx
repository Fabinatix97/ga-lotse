/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SvgIcon, SvgIconProps } from "@mui/joy";

export function EventUpcomingIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.4997 18.3337V16.667H15.833V7.50033H4.16634V11.667H2.49967V5.00033C2.49967 4.54199 2.66287 4.14963 2.98926 3.82324C3.31565 3.49685 3.70801 3.33366 4.16634 3.33366H4.99967V1.66699H6.66634V3.33366H13.333V1.66699H14.9997V3.33366H15.833C16.2913 3.33366 16.6837 3.49685 17.0101 3.82324C17.3365 4.14963 17.4997 4.54199 17.4997 5.00033V16.667C17.4997 17.1253 17.3365 17.5177 17.0101 17.8441C16.6837 18.1705 16.2913 18.3337 15.833 18.3337H12.4997ZM6.66634 20.0003L5.49967 18.8337L7.64551 16.667H0.833008V15.0003H7.64551L5.49967 12.8337L6.66634 11.667L10.833 15.8337L6.66634 20.0003Z"
          fill="#171A1C"
        />
      </svg>
    </SvgIcon>
  );
}
