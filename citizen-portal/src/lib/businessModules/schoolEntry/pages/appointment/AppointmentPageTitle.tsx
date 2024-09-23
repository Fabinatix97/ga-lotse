/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { LogoutOutlined } from "@mui/icons-material";

import { useTranslation } from "@/lib/i18n/client";
import { PageTitle } from "@/lib/shared/components/layout/page";

function LogoutButton() {
  const { t } = useTranslation(["schoolEntry/appointment"]);

  return (
    <InternalLinkButton
      href="/logout/keycloak"
      color="danger"
      variant="soft"
      endDecorator={<LogoutOutlined />}
    >
      {t("leave")}
    </InternalLinkButton>
  );
}

export function AppointmentPageTitle() {
  const { t } = useTranslation(["schoolEntry/appointment"]);

  return <PageTitle toolbar={<LogoutButton />}>{t("pageTitle")}</PageTitle>;
}
