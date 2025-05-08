/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AccessTimeOutlined,
  CakeOutlined,
  DateRange,
  FmdGoodOutlined,
  MailOutlined,
  MarkEmailReadOutlined,
  PersonOutlined,
  VaccinesOutlined,
} from "@mui/icons-material";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { isDefined } from "remeda";

import { useMultiStepForm } from "@eshg/lib-portal/components/form/MultiStepForm";
import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import {
  durationBetweenDatesInMinutes,
  formatDateToFullReadableString,
} from "@eshg/lib-portal/helpers/dateTime";

import { TravelInformationOverviewDetails } from "@/lib/businessModules/travelMedicine/components/appointment/steps/overview/TravelInformationOverviewDetails";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { useDepartmentContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/DepartmentContext";
import { APPOINTMENT_TYPE } from "@/lib/businessModules/travelMedicine/helpers/translations";
import { useTranslation } from "@/lib/i18n/client";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import { formatDepartmentAddress } from "@/lib/shared/formatters/address";

export function AppointmentOverviewDetails() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { values } = useFormikContext<InitialAppointmentFormValues>();
  const { currentStep } = useMultiStepForm();
  const { department } = useDepartmentContext();
  const appointmentStart = values.appointment?.start;
  const durationInMinutes =
    values.appointment &&
    durationBetweenDatesInMinutes(
      values.appointment?.start,
      values.appointment?.end,
    );

  return (
    <Stack gap={1} data-testid="appointment-overview-summary">
      {currentStep > 1 && values.initialStepAppointmentType && (
        <DetailsItem
          label={t("overview.fields.initialStepAppointmentType", {
            context: "label",
          })}
          value={APPOINTMENT_TYPE[values.initialStepAppointmentType]}
          icon={<VaccinesOutlined />}
          hiddenLabel
        />
      )}
      {isDefined(department) && (
        <DetailsItem
          label={t("overview.fields.department", {
            context: "label",
          })}
          value={formatDepartmentAddress(department)}
          icon={<FmdGoodOutlined />}
          hiddenLabel
        />
      )}
      {currentStep > 2 && (
        <>
          {appointmentStart && (
            <DetailsItem
              label={t("overview.fields.date", {
                context: "label",
              })}
              value={formatDateToFullReadableString(appointmentStart)}
              icon={<DateRange />}
              hiddenLabel
            />
          )}
          {durationInMinutes && (
            <DetailsItem
              label={t("overview.fields.time", {
                context: "label",
              })}
              value={`${formatTime(appointmentStart)} ${t("overview.fields.appointmentDuration", { durationInMinutes })}`}
              icon={<AccessTimeOutlined />}
              hiddenLabel
            />
          )}
        </>
      )}
      {currentStep > 5 && (
        <>
          {values.patient.firstName && values.patient.lastName && (
            <DetailsItem
              label={t("overview.fields.fullName", {
                context: "label",
              })}
              value={formatPersonName(values.patient)}
              icon={<PersonOutlined />}
              hiddenLabel
            />
          )}
          {values.patient.dateOfBirth && (
            <DetailsItem
              label={t("overview.fields.dateOfBirth", {
                context: "label",
              })}
              value={formatDate(new Date(values.patient.dateOfBirth))}
              icon={<CakeOutlined />}
              hiddenLabel
            />
          )}
        </>
      )}
      {currentStep > 3 && values.travelInformation.travelType && (
        <TravelInformationOverviewDetails />
      )}
      {currentStep > 5 && (
        <>
          {values.patient.emailAddresses && (
            <DetailsItem
              label={t("overview.fields.emailAddress", {
                context: "label",
              })}
              value={values.patient.emailAddresses}
              icon={<MailOutlined />}
              hiddenLabel
            />
          )}
          {values.confirmOnlineServices && (
            <DetailsItem
              label={t("overview.fields.confirmOnlineServices", {
                context: "label",
              })}
              value={t("overview.fields.confirmOnlineServices", {
                context: "value",
              })}
              icon={<MarkEmailReadOutlined />}
              hiddenLabel
            />
          )}
        </>
      )}
    </Stack>
  );
}
