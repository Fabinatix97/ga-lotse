/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ChevronRightOutlined,
  DateRangeOutlined,
  EventAvailableOutlined,
  EventBusyOutlined,
  EventOutlined,
  PeopleOutlined,
  VaccinesOutlined,
  WatchLaterOutlined,
} from "@mui/icons-material";
import { Button, Sheet } from "@mui/joy";
import { useRouter } from "next/navigation";

import {
  durationBetweenDatesInMinutes,
  formatDate,
  formatTime,
  useIsMobile,
} from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiAppointmentSummary,
  ApiAppointmentType,
} from "@eshg/travel-medicine-api";

import { theme } from "@/lib/baseModule/theme/theme";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { AppointmentOverviewButtonElement } from "@/lib/shared/components/appointments/AppointmentOverviewButtonElement";
import {
  AppointmentOverviewSection,
  AppointmentOverviewSectionGrid,
  AppointmentOverviewSectionText,
  AppointmentOverviewSectionTitle,
} from "@/lib/shared/components/appointments/AppointmentOverviewSection";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

interface AppointmentOverviewSheetButtonProps {
  index: number;
  procedureId: string;
  appointment: ApiAppointmentSummary;
}

export function AppointmentOverviewSheetButton(
  props: Readonly<AppointmentOverviewSheetButtonProps>,
) {
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();
  const isMobile = useIsMobile();
  const { t } = useTranslation(["travelMedicine/appointmentOverview"]);

  function navigateToDetails(procedureId: string, procedureStepId: string) {
    const url = `${citizenRoutes.viewAppointment.details.index(accessCode)}?procedureId=${procedureId}&procedureStepId=${procedureStepId}`;
    router.push(url);
  }

  function isCancelled() {
    return (
      props.appointment.appointmentBookingType ===
      ApiAppointmentBookingType.Cancelled
    );
  }

  function isBooked() {
    return (
      props.appointment.appointmentBookingType ===
        ApiAppointmentBookingType.AppointmentBlock ||
      props.appointment.appointmentBookingType ===
        ApiAppointmentBookingType.UserDefined
    );
  }

  return (
    <Button
      color="neutral"
      variant="plain"
      sx={{ padding: 0 }}
      onClick={() =>
        navigateToDetails(props.procedureId, props.appointment.procedureStepId)
      }
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
            backgroundColor: "#F0F4F8",
          },
        }}
      >
        <AppointmentOverviewSectionGrid>
          <AppointmentOverviewButtonElement
            icon={<DateRangeOutlined />}
            testId={`appointment-date-${props.index}`}
            text={formatDate(
              props.appointment.start ?? props.appointment.earliestDate,
            )}
          />
          {props.appointment.start && (
            <AppointmentOverviewSection icon={<WatchLaterOutlined />}>
              <AppointmentOverviewSectionTitle
                data-testid={`appointment-time-${props.index}`}
              >
                {t("appointmentCard.start", {
                  time: formatTime(props.appointment.start),
                })}
              </AppointmentOverviewSectionTitle>
              {props.appointment.start && props.appointment.end && (
                <AppointmentOverviewSectionText
                  data-testid={`appointment-duration-${props.index}`}
                >
                  {t("appointmentCard.duration", {
                    appointmentDuration: durationBetweenDatesInMinutes(
                      props.appointment.start,
                      props.appointment.end,
                    ),
                  })}
                </AppointmentOverviewSectionText>
              )}
            </AppointmentOverviewSection>
          )}
          {props.appointment.appointmentType ===
          ApiAppointmentType.Consultation ? (
            <AppointmentOverviewButtonElement
              icon={<PeopleOutlined />}
              testId={`appointment-type-${props.index}`}
              text={t("appointmentCard.appointmentType.consultation")}
            />
          ) : (
            <AppointmentOverviewButtonElement
              icon={<VaccinesOutlined />}
              testId={`appointment-type-${props.index}`}
              text={t("appointmentCard.appointmentType.vaccination")}
            />
          )}
          {isCancelled() ? (
            <AppointmentOverviewButtonElement
              icon={<EventBusyOutlined />}
              testId={`appointment-status-${props.index}`}
              text={t("appointmentStatus.cancelled")}
            />
          ) : isBooked() ? (
            <AppointmentOverviewButtonElement
              icon={<EventAvailableOutlined />}
              testId={`appointment-status-${props.index}`}
              text={t("appointmentStatus.booked")}
            />
          ) : (
            <AppointmentOverviewButtonElement
              icon={<EventOutlined />}
              testId={`appointment-status-${props.index}`}
              text={t("appointmentStatus.nonBooked")}
            />
          )}
        </AppointmentOverviewSectionGrid>
        <ChevronRightOutlined
          color="primary"
          size="md"
          sx={{
            alignSelf: isMobile ? "start" : "center",
          }}
        />
      </Sheet>
    </Button>
  );
}
