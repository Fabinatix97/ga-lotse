/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMultiStepForm } from "@eshg/lib-portal/components/form/MultiStepForm";
import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { formatDateToFullReadableString } from "@eshg/lib-portal/helpers/dateTime";
import {
  AccessTimeOutlined,
  CakeOutlined,
  DateRange,
  FmdGoodOutlined,
  HomeOutlined,
  MailOutlined,
  MarkEmailReadOutlined,
  MedicalServicesOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode } from "react";
import { Trans } from "react-i18next";
import { isDefined } from "remeda";

import { AppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";
import { useDepartmentContext } from "@/lib/businessModules/officialMedicalService/shared/contexts/DepartmentContext";
import { DetailsField } from "@/lib/businessModules/travelMedicine/components/shared/components/DetailsField";
import { formatDepartmentAddress } from "@/lib/businessModules/travelMedicine/helpers/appointmentFormHelper";
import { useTranslation } from "@/lib/i18n/client";
import {
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@/lib/shared/formatters/address";

export interface OverviewSectionProps {
  buttonBar?: ReactNode;
}

export function OverviewSection({ buttonBar }: Readonly<OverviewSectionProps>) {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
  const { department } = useDepartmentContext();
  const { values } = useFormikContext<AppointmentFormValues>();
  const { currentStep } = useMultiStepForm();

  return (
    <Stack gap={2} data-testid={"overview"}>
      <Typography level="h2">{t("overview.title")}</Typography>
      <Stack gap={1} data-testid={"appointment-overview-summary"}>
        {currentStep > 1 && (
          <DetailsField
            value={`${values.concern.nameDe} ${t("overview.values.appointmentDuration", { durationInMinutes: values.concern.standardDurationInMinutes })}`}
            icon={<MedicalServicesOutlined />}
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
            {values.appointment && (
              <DetailsField
                value={formatDateToFullReadableString(values.appointment.start)}
                icon={<DateRange />}
              />
            )}
            {values.appointment && (
              <DetailsField
                value={formatTime(values.appointment.start)}
                icon={<AccessTimeOutlined />}
              />
            )}
          </>
        )}
        {currentStep > 3 && (
          <>
            {values.affectedPerson.firstName &&
              values.affectedPerson.lastName && (
                <DetailsField
                  value={formatPersonName(values.affectedPerson)}
                  icon={<PersonOutlined />}
                />
              )}
            {values.affectedPerson.dateOfBirth && (
              <DetailsField
                value={formatDate(new Date(values.affectedPerson.dateOfBirth))}
                icon={<CakeOutlined />}
              />
            )}
            {values.affectedPerson.contactAddress.street &&
              values.affectedPerson.contactAddress.houseNumber &&
              values.affectedPerson.contactAddress.houseNumber &&
              values.affectedPerson.contactAddress.city && (
                <Stack gap={0}>
                  <DetailsField
                    value={
                      <Trans
                        i18nKey="overview.values.contactAddress"
                        ns="officialMedicalService/appointment"
                        values={{
                          street: formatStreetAndHouseNumber(
                            values.affectedPerson.contactAddress,
                          ),
                          city: formatPostalCodeAndCity(
                            values.affectedPerson.contactAddress,
                          ),
                        }}
                      />
                    }
                    icon={<HomeOutlined sx={{ alignSelf: "self-start" }} />}
                  />
                </Stack>
              )}
            {values.affectedPerson.emailAddresses && (
              <DetailsField
                value={values.affectedPerson.emailAddresses}
                icon={<MailOutlined />}
              />
            )}
            {values.confirmOnlineServices && (
              <DetailsField
                value={t("overview.values.confirmOnlineServices")}
                icon={<MarkEmailReadOutlined />}
              />
            )}
          </>
        )}
      </Stack>
      {isDefined(buttonBar) && buttonBar}
    </Stack>
  );
}
