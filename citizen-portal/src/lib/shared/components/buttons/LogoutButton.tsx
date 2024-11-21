/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { LogoutOutlined } from "@mui/icons-material";

import { useIsMobile } from "@/lib/shared/hooks/useIsMobile";

export function LogoutButton(props: { text: string }) {
  const isMobile = useIsMobile();

  return (
    <InternalLinkButton
      href="/logout/keycloak"
      color="danger"
      variant="soft"
      endDecorator={isMobile ? undefined : <LogoutOutlined />}
    >
      {isMobile ? <LogoutOutlined /> : props.text}
    </InternalLinkButton>
  );
}
