/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SvgIcon, SvgIconProps } from "@mui/joy";

export function EditDraftIcon(props: SvgIconProps) {
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
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4 3H20C21.1 3 22 3.9 22 5V7H20V5H4V19H12H20V17H22V19C22 20.1 21.1 21 20 21H12H4C2.9 21 2 20.1 2 19V5C2 3.9 2.9 3 4 3ZM10 7H5V9H10V7ZM10 11H5V13H10V11Z"
          fill="#171A1C"
        />
        <path
          d="M12 17V13.925L17.525 8.425C17.675 8.275 17.8417 8.16667 18.025 8.1C18.2083 8.03333 18.3917 8 18.575 8C18.775 8 18.9667 8.0375 19.15 8.1125C19.3333 8.1875 19.5 8.3 19.65 8.45L20.575 9.375C20.7083 9.525 20.8125 9.69167 20.8875 9.875C20.9625 10.0583 21 10.2417 21 10.425C21 10.6083 20.9667 10.7958 20.9 10.9875C20.8333 11.1792 20.725 11.35 20.575 11.5L15.075 17H12ZM13.5 15.5H14.45L17.475 12.45L17.025 11.975L16.55 11.525L13.5 14.55V15.5ZM17.025 11.975L16.55 11.525L17.475 12.45L17.025 11.975Z"
          fill="#171A1C"
        />
      </svg>
    </SvgIcon>
  );
}
