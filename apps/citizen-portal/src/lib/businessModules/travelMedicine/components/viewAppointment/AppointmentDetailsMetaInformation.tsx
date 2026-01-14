/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CakeOutlined,
  DateRangeOutlined,
  FmdGoodOutlined,
  PersonOutlined,
  VaccinesOutlined,
  WatchLaterOutlined,
} from "@mui/icons-material";
import { Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  DetailsList,
  durationBetweenDatesInMinutes,
  formatDate,
  formatPersonName,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
  formatTime,
} from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiGetAppointmentDetailsResponse,
} from "@eshg/travel-medicine-api";

import { useGetDepartmentInfoQuery } from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";
import { useTranslation } from "@/lib/i18n/client";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";

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
    <DetailsList data-testid="information-summary">
      <InfoSectionGrid>
        <DetailsItem
          label={t("patientName", {
            context: "label",
          })}
          value={formatPersonName(props.appointmentDetails)}
          icon={<PersonOutlined />}
          hiddenLabel
          slotProps={{ value: { level: "title-md" } }}
        />
        <DetailsItem
          label={t("dateOfBirth", {
            context: "label",
          })}
          value={formatDate(props.appointmentDetails.dateOfBirth)}
          icon={<CakeOutlined />}
          hiddenLabel
          slotProps={{ value: { level: "title-md" } }}
        />
        <DetailsItem
          label={t("appointmentDate", {
            context: "label",
          })}
          value={formatDate(
            props.appointmentDetails.summaryDto.start ??
              props.appointmentDetails.summaryDto.earliestDate,
          )}
          icon={<DateRangeOutlined />}
          hiddenLabel
          slotProps={{ value: { level: "title-md" } }}
        />
        <DetailsItem
          label={t("start", {
            context: "label",
          })}
          value={
            props.appointmentDetails.summaryDto.start !== undefined
              ? t("start", {
                  context: "value",
                  time: formatTime(props.appointmentDetails.summaryDto.start),
                })
              : t("appointment_bookable")
          }
          icon={<WatchLaterOutlined />}
          hiddenLabel
          slotProps={{ value: { level: "title-md" } }}
        />
        <Stack direction="column">
          <DetailsItem
            label={t("appointmentType", {
              context: "label",
            })}
            value={
              props.appointmentDetails.summaryDto.appointmentType ===
              ApiAppointmentType.Consultation
                ? t("appointmentType_value.consultation")
                : t("appointmentType_value.vaccination")
            }
            icon={<VaccinesOutlined />}
            hiddenLabel
            slotProps={{ value: { level: "title-md" } }}
          />
          {props.appointmentDetails.summaryDto.start && (
            <DetailsItem
              label={t("duration", {
                context: "label",
              })}
              value={t("duration", {
                context: "value",
                appointmentDuration: durationBetweenDatesInMinutes(
                  props.appointmentDetails.summaryDto.start,
                  props.appointmentDetails.summaryDto.end!,
                ),
              })}
              slotProps={{
                stack: { direction: "row", sx: { paddingLeft: 5 } },
                label: { level: "body-md" },
              }}
            />
          )}
        </Stack>
        <Stack direction="column">
          <DetailsItem
            label={t("departmentName", {
              context: "label",
            })}
            value={department.name}
            icon={<FmdGoodOutlined />}
            hiddenLabel
            slotProps={{ value: { level: "title-md" } }}
          />
          <DetailsItem
            label={t("departmentAddress", {
              context: "label",
            })}
            value={
              <>
                {formatStreetAndHouseNumber(department)}
                <br />
                {formatPostalCodeAndCity(department)}
              </>
            }
            hiddenLabel
            slotProps={{
              stack: { direction: "row", sx: { paddingLeft: 5 } },
            }}
          />
        </Stack>
      </InfoSectionGrid>
    </DetailsList>
  );
}
