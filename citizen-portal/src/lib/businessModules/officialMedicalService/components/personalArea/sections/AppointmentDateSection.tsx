/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { ApiOmsAppointment } from "@eshg/official-medical-service-api";
import { CakeOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";

export function AppointmentDateSection({
  appointment,
  localePath,
}: Readonly<{
  appointment: ApiOmsAppointment;
  localePath: string;
}>) {
  const { t } = useTranslation([`${localePath}`]);

  return (
    <InfoSection icon={<CakeOutlined />}>
      <InfoSectionTitle>
        {t("information.appointment_date_section.title")}
      </InfoSectionTitle>
      <Typography>{formatDate(appointment.start)}</Typography>
    </InfoSection>
  );
}
