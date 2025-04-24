/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMultiStepForm } from "@eshg/lib-portal/components/form/MultiStepForm";
import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import {
  durationBetweenDatesInMinutes,
  formatDateToFullReadableString,
} from "@eshg/lib-portal/helpers/dateTime";
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

import { TravelInformationOverviewDetails } from "@/lib/businessModules/travelMedicine/components/appointment/steps/overview/TravelInformationOverviewDetails";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { DetailsField } from "@/lib/businessModules/travelMedicine/components/shared/components/DetailsField";
import { useDepartmentContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/DepartmentContext";
import { APPOINTMENT_TYPE } from "@/lib/businessModules/travelMedicine/helpers/translations";
import { useTranslation } from "@/lib/i18n/client";
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
        <DetailsField
          value={APPOINTMENT_TYPE[values.initialStepAppointmentType]}
          icon={<VaccinesOutlined />}
        />
      )}
      {isDefined(department) && (
        <DetailsField
          value={formatDepartmentAddress(department)}
          icon={<FmdGoodOutlined />}
        />
      )}
      {currentStep > 2 && (
        <>
          {appointmentStart && (
            <DetailsField
              value={formatDateToFullReadableString(appointmentStart)}
              icon={<DateRange />}
            />
          )}
          {durationInMinutes && (
            <DetailsField
              value={`${formatTime(appointmentStart)} ${t("appointmentOverviewSection.values.appointmentDuration", { durationInMinutes })}`}
              icon={<AccessTimeOutlined />}
            />
          )}
        </>
      )}
      {currentStep > 5 && (
        <>
          {values.patient.firstName && values.patient.lastName && (
            <DetailsField
              value={formatPersonName(values.patient)}
              icon={<PersonOutlined />}
            />
          )}
          {values.patient.dateOfBirth && (
            <DetailsField
              value={formatDate(new Date(values.patient.dateOfBirth))}
              icon={<CakeOutlined />}
            />
          )}
        </>
      )}
      {currentStep > 3 && values.travelInformation.travelType && (
        <TravelInformationOverviewDetails></TravelInformationOverviewDetails>
      )}
      {currentStep > 5 && (
        <>
          {values.patient.emailAddresses && (
            <DetailsField
              value={values.patient.emailAddresses}
              icon={<MailOutlined />}
            />
          )}
          {values.confirmOnlineServices && (
            <DetailsField
              value={t(
                "appointmentOverviewSection.values.confirmOnlineServices",
              )}
              icon={<MarkEmailReadOutlined />}
            />
          )}
        </>
      )}
    </Stack>
  );
}
