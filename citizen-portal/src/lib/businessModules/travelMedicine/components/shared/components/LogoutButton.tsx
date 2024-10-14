/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { LogoutOutlined } from "@mui/icons-material";

export function LogoutButton() {
  return (
    <InternalLinkButton href="/logout/keycloak" color="danger" variant="soft">
      <LogoutOutlined />
    </InternalLinkButton>
  );
}
