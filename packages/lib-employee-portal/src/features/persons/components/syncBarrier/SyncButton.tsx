/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Warning } from "@mui/icons-material";
import { ComponentProps } from "react";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

type SyncButtonProps = ComponentProps<typeof InternalLinkButton>;

export function SyncButton(props: SyncButtonProps) {
  return (
    <InternalLinkButton
      startDecorator={<Warning />}
      color="danger"
      variant="soft"
      size="sm"
      {...props}
    >
      {props.children ?? "Update"}
    </InternalLinkButton>
  );
}
