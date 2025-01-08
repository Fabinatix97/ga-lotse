/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiGetAppointmentDetailsResponse,
} from "@eshg/citizen-portal-api/travelMedicine";
import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { durationBetweenDatesInMinutes } from "@eshg/lib-portal/helpers/dateTime";
import {
  CakeOutlined,
  DateRangeOutlined,
  FmdGoodOutlined,
  PersonOutlined,
  VaccinesOutlined,
  WatchLaterOutlined,
} from "@mui/icons-material";
import { Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetDepartmentInfoQuery } from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionGrid,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import {
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@/lib/shared/formatters/address";

interface AppointmentDetailsMetaInformationProps {
  appointmentDetails: ApiGetAppointmentDetailsResponse;
}

export function AppointmentDetailsMetaInformation(
  props: Readonly<AppointmentDetailsMetaInformationProps>,
) {
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);
  const [{ data: department }] = useSuspenseQueries({
    queries: [useGetDepartmentInfoQuery()],
  });

  return (
    <InfoSectionGrid>
      <InfoSection icon={<PersonOutlined />}>
        <InfoSectionTitle data-testid="patient-name">
          {props.appointmentDetails.firstName}{" "}
          {props.appointmentDetails.lastName}
        </InfoSectionTitle>
      </InfoSection>
      <InfoSection icon={<CakeOutlined />}>
        <InfoSectionTitle data-testid="patient-date-of-birth">
          {formatDate(props.appointmentDetails.dateOfBirth)}
        </InfoSectionTitle>
      </InfoSection>
      <InfoSection icon={<DateRangeOutlined />}>
        <InfoSectionTitle data-testid="appointment-date">
          {formatDate(
            props.appointmentDetails.summaryDto.start ??
              props.appointmentDetails.summaryDto.earliestDate,
          )}
        </InfoSectionTitle>
      </InfoSection>
      <InfoSection icon={<WatchLaterOutlined />}>
        <InfoSectionTitle data-testid="appointment-time">
          {props.appointmentDetails.summaryDto.start !== undefined
            ? t("start", {
                time: formatTime(props.appointmentDetails.summaryDto.start),
              })
            : "Noch nicht gebucht"}
        </InfoSectionTitle>
      </InfoSection>
      <InfoSection icon={<VaccinesOutlined />}>
        <InfoSectionTitle data-testid="appointment-type">
          {props.appointmentDetails.summaryDto.appointmentType ===
          ApiAppointmentType.Consultation
            ? t("appointmentType.consultation")
            : t("appointmentType.vaccination")}
        </InfoSectionTitle>
        {props.appointmentDetails.summaryDto.start && (
          <Typography data-testid="appointment-duration">
            {t("duration", {
              appointmentDuration: durationBetweenDatesInMinutes(
                props.appointmentDetails.summaryDto.start,
                props.appointmentDetails.summaryDto.end!,
              ),
            })}
          </Typography>
        )}
      </InfoSection>
      <InfoSection icon={<FmdGoodOutlined />}>
        <InfoSectionTitle data-testid="department-name">
          {department.name}
        </InfoSectionTitle>
        <Typography data-testid="department-address">
          {formatStreetAndHouseNumber(department)}
          <br />
          {formatPostalCodeAndCity(department)}
        </Typography>
      </InfoSection>
    </InfoSectionGrid>
  );
}
