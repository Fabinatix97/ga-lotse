/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { LogoutOutlined } from "@mui/icons-material";

import { useIsMobile } from "@/lib/businessModules/travelMedicine/shared/useIsMobile";
import { useTranslation } from "@/lib/i18n/client";
import { PageTitle } from "@/lib/shared/components/layout/page";

function LogoutButton() {
  return (
    <InternalLinkButton href="/logout/keycloak" color="danger" variant="soft">
      <LogoutOutlined />
    </InternalLinkButton>
  );
}

function LogoutButtonWithText() {
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

interface AppointmentPageTitleProps {
  title: string;
}

export function AppointmentPageTitle(
  props: Readonly<AppointmentPageTitleProps>,
) {
  const isMobile = useIsMobile();
  return (
    <PageTitle toolbar={isMobile ? <LogoutButton /> : <LogoutButtonWithText />}>
      {props.title}
    </PageTitle>
  );
}
