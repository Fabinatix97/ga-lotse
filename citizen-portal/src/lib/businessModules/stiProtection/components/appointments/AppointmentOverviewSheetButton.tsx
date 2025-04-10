/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { durationBetweenDatesInMinutes } from "@eshg/lib-portal/helpers/dateTime";
import { useIsMobile } from "@eshg/lib-portal/hooks/useIsMobile";
import {
  ApiAppointmentStatus,
  ApiAppointmentType,
  ApiConcern,
} from "@eshg/sti-protection-api";
import {
  ChevronRightOutlined,
  DateRangeOutlined,
  EventAvailableOutlined,
  EventBusyOutlined,
  EventOutlined,
  MedicalServicesOutlined,
  PeopleAltOutlined,
  WatchLaterOutlined,
} from "@mui/icons-material";
import { Sheet } from "@mui/joy";

import { theme } from "@/lib/baseModule/theme/theme";
import { useConcernedCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { AppointmentOverviewButtonElement } from "@/lib/shared/components/appointments/AppointmentOverviewButtonElement";
import {
  AppointmentOverviewSection,
  AppointmentOverviewSectionGrid,
  AppointmentOverviewSectionText,
  AppointmentOverviewSectionTitle,
} from "@/lib/shared/components/appointments/AppointmentOverviewSection";
import { HivOutlined } from "@/lib/shared/components/icons/HivOutlined";

import { ApiAppointmentSummary } from "./helpers";

interface AppointmentOverviewSheetButtonProps {
  index: number;
  appointment: ApiAppointmentSummary;
  concern: ApiConcern;
  accessCode: string;
}

export function AppointmentOverviewSheetButton({
  index: _apptIndex,
  appointment,
  concern,
  accessCode,
}: Readonly<AppointmentOverviewSheetButtonProps>) {
  const citizenRoutes = useConcernedCitizenRoutes(concern);
  const isMobile = useIsMobile();
  const { t } = useTranslation(["stiProtection/appointmentOverview"]);

  const { statusTextKey, statusIcon } = getStatusAndIcon(
    appointment.appointmentStatus,
  );

  return (
    <InternalLinkButton
      color={"neutral"}
      variant={"plain"}
      sx={{ padding: 0 }}
      href={citizenRoutes.personalArea.index(accessCode)}
    >
      <Sheet
        component="section"
        sx={{
          display: "flex",
          flexGrow: 1,
          [theme.breakpoints.down("sm")]: {
            borderRadius: 0,
          },
          "&:hover": {
            filter: "brightness(90%)",
          },
        }}
      >
        <AppointmentOverviewSectionGrid
          columns={byBreakpoint({ mobile: 1, desktop: 5 })}
        >
          <AppointmentOverviewButtonElement
            icon={<DateRangeOutlined />}
            text={formatDate(appointment.start)}
          />
          {appointment.start && (
            <AppointmentOverviewSection icon={<WatchLaterOutlined />}>
              <AppointmentOverviewSectionTitle>
                {t("appointment_card.start", {
                  time: formatTime(appointment.start),
                })}
              </AppointmentOverviewSectionTitle>
              {appointment.start && appointment.end && (
                <AppointmentOverviewSectionText>
                  {t("appointment_card.duration", {
                    appointmentDuration: durationBetweenDatesInMinutes(
                      appointment.start,
                      appointment.end,
                    ),
                  })}
                </AppointmentOverviewSectionText>
              )}
            </AppointmentOverviewSection>
          )}
          {appointment.appointmentType ===
          ApiAppointmentType.HivStiConsultation ? (
            <AppointmentOverviewButtonElement
              icon={<HivOutlined />}
              text={t("appointment_card.appointment_type.hiv_sti")}
            />
          ) : (
            <AppointmentOverviewButtonElement
              icon={<MedicalServicesOutlined />}
              text={t("appointment_card.appointment_type.sex_work")}
            />
          )}
          <AppointmentOverviewButtonElement
            icon={<PeopleAltOutlined />}
            text={t("appointment_card.appointment_type.consultation")}
          />
          <AppointmentOverviewButtonElement
            icon={statusIcon}
            text={t(statusTextKey)}
          />
        </AppointmentOverviewSectionGrid>
        <ChevronRightOutlined
          color={"primary"}
          size={"md"}
          sx={{
            alignSelf: isMobile ? "start" : "center",
          }}
        />
      </Sheet>
    </InternalLinkButton>
  );
}

function getStatusAndIcon(status: ApiAppointmentStatus | undefined) {
  switch (status) {
    case undefined:
      return {
        statusIcon: <EventOutlined />,
        statusTextKey: "appointment_status.non_booked",
      };
    case ApiAppointmentStatus.Open:
      return {
        statusIcon: <EventAvailableOutlined />,
        statusTextKey: "appointment_status.booked",
      };
    case ApiAppointmentStatus.Closed:
      return {
        statusIcon: <EventAvailableOutlined />,
        statusTextKey: "appointment_status.closed",
      };
    case ApiAppointmentStatus.Cancelled:
      return {
        statusIcon: <EventBusyOutlined />,
        statusTextKey: "appointment_status.cancelled",
      };
  }
}
