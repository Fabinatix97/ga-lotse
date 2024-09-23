/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { formatDateToFullReadableString } from "@eshg/lib-portal/helpers/dateTime";
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

import { TravelInformationOverviewDetails } from "@/lib/businessModules/travelMedicine/components/appointment/steps/overview/TravelInformationOverviewDetails";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { DetailsField } from "@/lib/businessModules/travelMedicine/components/shared/components/DetailsField";
import { useDepartmentContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/DepartmentContext";
import { formatDepartmentAddress } from "@/lib/businessModules/travelMedicine/helpers/appointmentFormHelper";
import { APPOINTMENT_TYPE } from "@/lib/businessModules/travelMedicine/helpers/translations";
import { useTranslation } from "@/lib/i18n/client";

export function AppointmentOverviewDetails() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { values } = useFormikContext<InitialAppointmentFormValues>();
  const department = useDepartmentContext();
  const splitArr = values.appointmentBlockDate.split(",");
  const split = splitArr.at(0);
  const appointmentStart = new Date(split!);

  return (
    <Stack gap={1} data-testid="appointment-overview-summary">
      {values.initialStepAppointmentType && (
        <DetailsField
          value={APPOINTMENT_TYPE[values.initialStepAppointmentType]}
          icon={<VaccinesOutlined />}
        />
      )}
      <DetailsField
        value={formatDepartmentAddress(department.department!)}
        icon={<FmdGoodOutlined />}
      />
      {values.appointmentBlockDate && (
        <DetailsField
          value={formatDateToFullReadableString(appointmentStart)}
          icon={<DateRange />}
        />
      )}
      {values.appointmentBlockDate && (
        <DetailsField
          value={formatTime(appointmentStart)}
          icon={<AccessTimeOutlined />}
        />
      )}
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
      {values.travelInformation.travelType && (
        <TravelInformationOverviewDetails></TravelInformationOverviewDetails>
      )}
      {/*needs feedback from ui team*/}
      {/*{!!values.patient.phoneNumbers && (*/}
      {/*  <DetailsField*/}
      {/*    value={values.patient.phoneNumbers}*/}
      {/*    icon={<CallOutlined />}*/}
      {/*  />*/}
      {/*)}*/}
      {values.patient.emailAddresses && (
        <DetailsField
          value={values.patient.emailAddresses}
          icon={<MailOutlined />}
        />
      )}
      {values.confirmOnlineServices && (
        <DetailsField
          value={t("appointmentOverviewSection.values.confirmOnlineServices")}
          icon={<MarkEmailReadOutlined />}
        />
      )}
    </Stack>
  );
}
