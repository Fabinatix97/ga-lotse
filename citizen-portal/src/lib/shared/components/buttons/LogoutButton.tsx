/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { LogoutOutlined } from "@mui/icons-material";

import { InternalLinkButton, useIsMobile } from "@eshg/lib-portal";

export function LogoutButton(props: { text: string }) {
  const isMobile = useIsMobile();

  return (
    <InternalLinkButton
      href="/logout/keycloak"
      color="danger"
      variant="soft"
      aria-label={isMobile ? props.text : undefined}
      endDecorator={isMobile ? undefined : <LogoutOutlined />}
    >
      {isMobile ? <LogoutOutlined /> : props.text}
    </InternalLinkButton>
  );
}
