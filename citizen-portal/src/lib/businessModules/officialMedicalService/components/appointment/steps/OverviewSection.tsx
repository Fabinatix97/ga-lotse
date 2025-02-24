/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMultiStepForm } from "@eshg/lib-portal/components/form/MultiStepForm";
import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { formatDateToFullReadableString } from "@eshg/lib-portal/helpers/dateTime";
import { ApiDomesticAddress } from "@eshg/official-medical-service-api";
import {
  AccessTimeOutlined,
  CakeOutlined,
  DateRange,
  FmdGoodOutlined,
  HomeOutlined,
  MailOutlined,
  MarkEmailReadOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { AppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";
import { useDepartmentContext } from "@/lib/businessModules/officialMedicalService/shared/contexts/DepartmentContext";
import { DetailsField } from "@/lib/businessModules/travelMedicine/components/shared/components/DetailsField";
import { formatDepartmentAddress } from "@/lib/businessModules/travelMedicine/helpers/appointmentFormHelper";
import { useTranslation } from "@/lib/i18n/client";

export function formatStreet(address: ApiDomesticAddress) {
  const { houseNumber, street } = address;
  return `${street}, ${houseNumber}`;
}
export function formatCity(address: ApiDomesticAddress) {
  const { city, postalCode } = address;
  return `${city}, ${postalCode}`;
}

export interface OverviewSectionProps {
  buttonBar?: ReactNode;
}

export function OverviewSection({ buttonBar }: Readonly<OverviewSectionProps>) {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
  const { department } = useDepartmentContext();
  const { values } = useFormikContext<AppointmentFormValues>();
  const { currentStep, totalSteps } = useMultiStepForm();

  return (
    <>
      <Typography level="h2">{t("overview.title")}</Typography>
      <Stack gap={2}>
        <Stack gap={1}>
          {/*ToDo: add concern*/}
          {/*{currentStep > 1 && (*/}
          {/*  <>*/}
          {/*  </>*/}
          {/*)}*/}
          {currentStep > 2 && (
            <>
              {currentStep === totalSteps && isDefined(department) && (
                <DetailsField
                  value={formatDepartmentAddress(department)}
                  icon={<FmdGoodOutlined />}
                />
              )}
              {values.appointment && (
                <DetailsField
                  value={formatDateToFullReadableString(
                    values.appointment.start,
                  )}
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
                  value={formatDate(
                    new Date(values.affectedPerson.dateOfBirth),
                  )}
                  icon={<CakeOutlined />}
                />
              )}
              {values.affectedPerson.contactAddress.street &&
                values.affectedPerson.contactAddress.houseNumber &&
                values.affectedPerson.contactAddress.houseNumber &&
                values.affectedPerson.contactAddress.city && (
                  <Stack gap={0}>
                    <DetailsField
                      value={formatStreet(
                        values.affectedPerson
                          .contactAddress as ApiDomesticAddress,
                      )}
                      icon={<HomeOutlined />}
                    />
                    <Typography sx={{ paddingInlineStart: "2.25rem" }}>
                      {formatCity(
                        values.affectedPerson
                          .contactAddress as ApiDomesticAddress,
                      )}
                    </Typography>
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
    </>
  );
}
