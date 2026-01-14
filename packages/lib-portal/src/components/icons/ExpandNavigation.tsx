/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SvgIcon, SvgIconProps } from "@mui/joy";

export function ExpandNavigation(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.00006 20.0002L20.0001 20.0002C21.1001 20.0002 22.0001 19.1002 22.0001 18.0002L22.0001 6.00018C22.0001 4.90018 21.1001 4.00018 20.0001 4.00018L4.00006 4.00018C2.90006 4.00018 2.00006 4.90018 2.00006 6.00018L2.00006 18.0002C2.00006 19.1002 2.90006 20.0002 4.00006 20.0002ZM20.0001 18.0002H10.0001L10.0001 6.00018L20.0001 6.00018V18.0002ZM4.00006 6.00018H8.00006L8.00006 18.0002H4.00006L4.00006 6.00018Z"
          fill="currentColor"
        />
      </svg>
    </SvgIcon>
  );
}
