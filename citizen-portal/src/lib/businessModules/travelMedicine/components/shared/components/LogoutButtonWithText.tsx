/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { LogoutOutlined } from "@mui/icons-material";

import { useTranslation } from "@/lib/i18n/client";

export function LogoutButtonWithText() {
  const { t } = useTranslation(["travelMedicine/appointmentOverview"]);

  return (
    <InternalLinkButton
      href="/logout/keycloak"
      color="danger"
      variant="soft"
      endDecorator={<LogoutOutlined />}
    >
      {t("header.logout")}
    </InternalLinkButton>
  );
}
