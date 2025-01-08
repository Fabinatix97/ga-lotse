/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useTranslation } from "@/lib/i18n/client";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageTitle } from "@/lib/shared/components/layout/page";

interface AppointmentPageTitleProps {
  title: string;
}

export function AppointmentPageTitle(
  props: Readonly<AppointmentPageTitleProps>,
) {
  const { t } = useTranslation(["travelMedicine/appointmentOverview"]);

  return (
    <PageTitle toolbar={<LogoutButton text={t("header.logout")} />}>
      {props.title}
    </PageTitle>
  );
}
