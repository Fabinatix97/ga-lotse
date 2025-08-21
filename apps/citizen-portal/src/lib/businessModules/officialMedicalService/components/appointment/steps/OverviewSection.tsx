/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import {
  DetailsColumn,
  DetailsList,
  formatDate,
  formatDateToFullReadableString,
  formatPersonName,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
  formatTime,
  useMultiStepForm,
} from "@eshg/lib-portal";

import { AppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";
import { useDepartmentContext } from "@/lib/businessModules/officialMedicalService/shared/contexts/DepartmentContext";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import { ContentSheetTitle } from "@/lib/shared/components/layout/contentSheet";
import { formatDepartmentAddress } from "@/lib/shared/formatters/address";
import { useManualTranslation } from "@/lib/shared/hooks/useManualTranslation";

interface OverviewSectionProps {
  buttonBar?: ReactNode;
}

export function OverviewSection({ buttonBar }: Readonly<OverviewSectionProps>) {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
  const { department } = useDepartmentContext();
  const { values } = useFormikContext<AppointmentFormValues>();
  const { currentStep } = useMultiStepForm();

  const concernName = useManualTranslation({
    de: values.concern.nameDe,
    en: values.concern.nameEn,
  });

  return (
    <>
      <ContentSheetTitle>{t("overview.title")}</ContentSheetTitle>
      <DetailsList data-testid="appointment-overview-summary">
        <DetailsColumn sx={{ gap: byBreakpoint({ mobile: 1, desktop: 2 }) }}>
          {currentStep > 1 && (
            <DetailsItem
              label={t("overview.fields.concernAndDuration", {
                context: "label",
              })}
              value={`${concernName} ${t("overview.fields.appointmentDuration", { durationInMinutes: values.concern.standardDurationInMinutes })}`}
              icon={<MedicalServicesOutlined />}
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
              {values.appointment && (
                <DetailsItem
                  label={t("overview.fields.date", {
                    context: "label",
                  })}
                  value={formatDateToFullReadableString(
                    values.appointment.start,
                  )}
                  icon={<DateRange />}
                  hiddenLabel
                />
              )}
              {values.appointment && (
                <DetailsItem
                  label={t("overview.fields.time", {
                    context: "label",
                  })}
                  value={t("overview.fields.time", {
                    appointmentStart: formatTime(values.appointment?.start),
                    context: "value",
                  })}
                  icon={<AccessTimeOutlined />}
                  hiddenLabel
                />
              )}
            </>
          )}
          {currentStep > 3 && (
            <>
              {values.affectedPerson.firstName &&
                values.affectedPerson.lastName && (
                  <DetailsItem
                    label={t("overview.fields.fullName", {
                      context: "label",
                    })}
                    value={formatPersonName(values.affectedPerson)}
                    icon={<PersonOutlined />}
                    hiddenLabel
                  />
                )}
              {values.affectedPerson.dateOfBirth && (
                <DetailsItem
                  label={t("overview.fields.dateOfBirth", {
                    context: "label",
                  })}
                  value={formatDate(
                    new Date(values.affectedPerson.dateOfBirth),
                  )}
                  icon={<CakeOutlined />}
                  hiddenLabel
                />
              )}
              {values.affectedPerson.contactAddress && (
                <Stack direction="column" gap={0.5}>
                  <DetailsItem
                    label={t("overview.fields.street", {
                      context: "label",
                    })}
                    value={formatStreetAndHouseNumber(
                      values.affectedPerson.contactAddress,
                    )}
                    icon={<HomeOutlined sx={{ alignSelf: "self-start" }} />}
                    hiddenLabel
                  />
                  <DetailsItem
                    label={t("overview.fields.city", {
                      context: "label",
                    })}
                    value={formatPostalCodeAndCity(
                      values.affectedPerson.contactAddress,
                    )}
                    hiddenLabel
                    slotProps={{
                      value: { sx: { paddingLeft: 5 } },
                    }}
                  />
                </Stack>
              )}
              {values.affectedPerson.emailAddresses && (
                <DetailsItem
                  label={t("overview.fields.emailAddress", {
                    context: "label",
                  })}
                  value={values.affectedPerson.emailAddresses}
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
        </DetailsColumn>
      </DetailsList>
      {isDefined(buttonBar) && buttonBar}
    </>
  );
}
