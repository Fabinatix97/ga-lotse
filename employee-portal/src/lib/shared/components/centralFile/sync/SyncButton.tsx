/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";
import { ButtonProps } from "@mui/joy";

export function SyncButton(
  props: Omit<ButtonProps<typeof NavigationLink>, "component">,
) {
  return (
    <InternalLinkButton
      startDecorator={<WarningIcon />}
      color="danger"
      variant="soft"
      size="sm"
      {...props}
    >
      {props.children ?? "Update"}
    </InternalLinkButton>
  );
}
