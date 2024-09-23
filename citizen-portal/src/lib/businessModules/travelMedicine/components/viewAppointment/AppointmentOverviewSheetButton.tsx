/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentSummary,
  ApiAppointmentType,
} from "@eshg/citizen-portal-api/travelMedicine";
import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { durationBetweenDatesInMinutes } from "@eshg/lib-portal/helpers/dateTime";
import {
  ChevronRightOutlined,
  DateRangeOutlined,
  EventAvailableOutlined,
  PeopleOutlined,
  VaccinesOutlined,
  WatchLaterOutlined,
} from "@mui/icons-material";
import { Button, Sheet } from "@mui/joy";
import { useRouter } from "next/navigation";

import { theme } from "@/lib/baseModule/theme/theme";
import {
  AppointmentOverviewSection,
  AppointmentOverviewSectionGrid,
  AppointmentOverviewSectionText,
  AppointmentOverviewSectionTitle,
} from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentOverviewSection";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useIsMobile } from "@/lib/businessModules/travelMedicine/shared/useIsMobile";
import { useTranslation } from "@/lib/i18n/client";
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
    const url = `${citizenRoutes.viewAppointment.details(accessCode)}?procedureId=${procedureId}&procedureStepId=${procedureStepId}`;
    router.push(url);
  }

  return (
    <Button
      color={"neutral"}
      variant={"plain"}
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
          <AppointmentOverviewSection icon={<DateRangeOutlined />}>
            <AppointmentOverviewSectionTitle
              data-testid={`appointment-date-${props.index}`}
            >
              {formatDate(props.appointment.start)}
            </AppointmentOverviewSectionTitle>
          </AppointmentOverviewSection>
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
          {props.appointment.appointmentType ===
          ApiAppointmentType.Consultation ? (
            <AppointmentOverviewSection icon={<PeopleOutlined />}>
              <AppointmentOverviewSectionTitle
                data-testid={`appointment-type-${props.index}`}
              >
                {t("appointmentCard.appointmentType.consultation")}
              </AppointmentOverviewSectionTitle>
            </AppointmentOverviewSection>
          ) : (
            <AppointmentOverviewSection icon={<VaccinesOutlined />}>
              <AppointmentOverviewSectionTitle
                data-testid={`appointment-type-${props.index}`}
              >
                {t("appointmentCard.appointmentType.vaccination")}
              </AppointmentOverviewSectionTitle>
            </AppointmentOverviewSection>
          )}
          <AppointmentOverviewSection icon={<EventAvailableOutlined />}>
            {/* TODO make text and icon dynamic when status is used */}
            <AppointmentOverviewSectionTitle
              data-testid={`appointment-status-${props.index}`}
            >
              {t("appointmentStatus.booked")}
            </AppointmentOverviewSectionTitle>
          </AppointmentOverviewSection>
        </AppointmentOverviewSectionGrid>
        <ChevronRightOutlined
          color={"primary"}
          size={"md"}
          sx={{
            alignSelf: isMobile ? "start" : "center",
          }}
        />
      </Sheet>
    </Button>
  );
}
