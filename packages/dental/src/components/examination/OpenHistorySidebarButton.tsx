/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { Typography } from "@mui/joy";
import { ComponentProps } from "react";

export function OpenHistorySidebarButton(
  props: ComponentProps<typeof ButtonLink>,
) {
  const { children, ...buttonProps } = props;

  return (
    <Typography color="primary">
      (<ButtonLink {...buttonProps}>{children}</ButtonLink>)
    </Typography>
  );
}
