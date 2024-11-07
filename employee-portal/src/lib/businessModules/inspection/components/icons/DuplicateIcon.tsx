/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SvgIcon, SvgIconProps } from "@mui/joy";

export function DuplicateIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.1667 0.833984H2.16667C1.25 0.833984 0.5 1.58398 0.5 2.50065V14.1673H2.16667V2.50065C6.07191 2.50065 8.26142 2.50065 12.1667 2.50065V0.833984ZM13.8333 4.16732H5.5C4.58333 4.16732 3.83333 4.91732 3.83333 5.83398V17.5006C3.83333 18.4173 4.58333 19.1673 5.5 19.1673H13.8333C14.75 19.1673 15.5 18.4173 15.5 17.5006V5.83398C15.5 4.91732 14.75 4.16732 13.8333 4.16732ZM13.8333 17.5006H5.5V5.83398H13.8333V17.5006Z"
          fill="#9A5B13"
        />
        <path
          d="M8.83333 7.50065H10.5V12.5007H8.83333V7.50065Z"
          fill="#9A5B13"
        />
        <path
          d="M8.83333 14.1673H10.5V15.834H8.83333V14.1673Z"
          fill="#9A5B13"
        />
      </svg>
    </SvgIcon>
  );
}
