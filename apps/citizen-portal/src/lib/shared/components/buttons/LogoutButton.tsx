/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { LogoutOutlined } from "@mui/icons-material";

import { useIsMobile } from "@eshg/lib-portal";

import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";

export function LogoutButton(props: { text: string }) {
  const isMobile = useIsMobile();

  return (
    <ScopedInternalLinkButton
      href="/logout/keycloak"
      color="danger"
      variant="soft"
      aria-label={isMobile ? props.text : undefined}
      endDecorator={isMobile ? undefined : <LogoutOutlined />}
    >
      {isMobile ? <LogoutOutlined /> : props.text}
    </ScopedInternalLinkButton>
  );
}
