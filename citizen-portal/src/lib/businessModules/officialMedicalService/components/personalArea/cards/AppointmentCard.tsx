/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { EnumMap } from "@eshg/lib-portal/types/helpers";
import {
  ApiBookingState,
  ApiOmsAppointment,
} from "@eshg/official-medical-service-api";
import {
  DateRangeOutlined,
  EventOutlined,
  WatchLaterOutlined,
} from "@mui/icons-material";
import { Chip, Stack, Typography } from "@mui/joy";
import { ColorPaletteProp, DefaultColorPalette } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import { theme } from "@/lib/baseModule/theme/theme";
import { useTranslation } from "@/lib/i18n/client";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

interface AppointmentCardProps {
  appointment: ApiOmsAppointment;
}

const BOOKING_STATE_COLORS: EnumMap<ApiBookingState, DefaultColorPalette> = {
  [ApiBookingState.Bookable]: "warning",
  [ApiBookingState.Booked]: "success",
  [ApiBookingState.Cancelled]: "danger",
  [ApiBookingState.Withdrawn]: "danger",
} as const;

export function AppointmentAlert({ appointment }: AppointmentCardProps) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  const color: ColorPaletteProp =
    appointment.bookingState === ApiBookingState.Bookable
      ? "primary"
      : "danger";

  const message =
    appointment.bookingState === ApiBookingState.Bookable
      ? t("appointment.alert.message", {
          context: appointment.bookingState,
        })
      : appointment.reasonForRejection
          ?.split("\\n")
          .map((str) => <div key={str}>{str}</div>);

  return (
    <Alert
      title={t("appointment.alert.title", {
        context: appointment.bookingState,
      })}
      message={message}
      color={color}
    />
  );
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  function shouldShowAppointmentAlert() {
    return !!(
      appointment.bookingState === ApiBookingState.Bookable ||
      (appointment.bookingState === ApiBookingState.Cancelled &&
        appointment.reasonForRejection)
    );
  }

  return (
    <ContentSheet data-testid="appointment-card">
      <ContentSheetTitle>{t("appointment.title")}</ContentSheetTitle>
      <Stack direction="column" gap={3}>
        {shouldShowAppointmentAlert() && (
          <AppointmentAlert appointment={appointment} />
        )}
        <InfoSectionGrid>
          {isDefined(appointment.bookingState) && (
            <DetailsItem
              label={t("appointment.bookingState.label")}
              value={
                <Chip
                  color={BOOKING_STATE_COLORS[appointment.bookingState]}
                  size="lg"
                  sx={{ fontWeight: theme.fontWeight.md }}
                >
                  {t(
                    `appointment.bookingState.value.${appointment.bookingState}`,
                  )}
                </Chip>
              }
              icon={<EventOutlined />}
            />
          )}
          {appointmentHasDate(appointment) && (
            <DetailsItem
              label={t("appointment.date_label")}
              value={formatDate(appointment.start)}
              icon={<DateRangeOutlined />}
            />
          )}
          {appointmentHasDate(appointment) && (
            <DetailsItem
              label={t("appointment.appointmentTime.label")}
              value={
                <Stack direction="column" gap={0.5}>
                  <Typography>
                    {t("appointment.appointmentTime.time", {
                      time: formatTime(appointment.start),
                    })}
                  </Typography>
                  <Typography>
                    {t("appointment.appointmentTime.duration", {
                      duration: appointment.duration,
                    })}
                  </Typography>
                </Stack>
              }
              icon={<WatchLaterOutlined />}
            />
          )}
        </InfoSectionGrid>
      </Stack>
    </ContentSheet>
  );
}

function appointmentHasDate(
  appointment: ApiOmsAppointment | undefined,
): appointment is ApiOmsAppointment {
  return (
    appointment !== undefined &&
    appointment.bookingState !== ApiBookingState.Bookable
  );
}
