/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useTranslation } from "@/lib/i18n/client";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageTitle } from "@/lib/shared/components/layout/page";

export function AppointmentPageTitle() {
  const { t } = useTranslation(["schoolEntry/appointment"]);

  return (
    <PageTitle toolbar={<LogoutButton text={t("leave")} />}>
      {t("pageTitle")}
    </PageTitle>
  );
}
