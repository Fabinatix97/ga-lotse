/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { ApiOmsAppointment } from "@eshg/official-medical-service-api";
import { CakeOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";

export function AppointmentTimeSection({
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
        {t("information.appointment_time_section.title")}
      </InfoSectionTitle>
      <Typography>
        {t("information.appointment_time_section.time", {
          time: formatTime(appointment.start),
        })}
      </Typography>
      <Typography>
        {t("information.appointment_time_section.duration", {
          duration: appointment.duration,
        })}
      </Typography>
    </InfoSection>
  );
}
