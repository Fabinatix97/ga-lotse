/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Warning } from "@mui/icons-material";
import { ComponentProps } from "react";

import { InternalLinkButton } from "@eshg/lib-portal";

type SyncButtonProps = ComponentProps<typeof InternalLinkButton>;

export function SyncButton(props: SyncButtonProps) {
  return (
    <InternalLinkButton
      startDecorator={<Warning />}
      color="danger"
      variant="soft"
      size="sm"
      aria-label="Daten aktualisieren"
      {...props}
    >
      {props.children ?? "Update"}
    </InternalLinkButton>
  );
}
