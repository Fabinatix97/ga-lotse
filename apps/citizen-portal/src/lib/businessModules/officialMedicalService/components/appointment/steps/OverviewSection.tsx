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
import { Trans } from "react-i18next";
import { isDefined } from "remeda";

import {
  formatDate,
  formatDateToFullReadableString,
  formatPersonName,
  formatTime,
  useMultiStepForm,
} from "@eshg/lib-portal";

import { AppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";
import { useDepartmentContext } from "@/lib/businessModules/officialMedicalService/shared/contexts/DepartmentContext";
import { useTranslation } from "@/lib/i18n/client";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import { ContentSheetTitle } from "@/lib/shared/components/layout/contentSheet";
import {
  formatDepartmentAddress,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@/lib/shared/formatters/address";
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
    <Stack gap={2} data-testid="overview">
      <ContentSheetTitle>{t("overview.title")}</ContentSheetTitle>
      <Stack gap={1} data-testid="appointment-overview-summary" role="list">
        {currentStep > 1 && (
          <DetailsItem
            slotProps={{
              stack: { role: "listitem" },
            }}
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
            slotProps={{
              stack: { role: "listitem" },
            }}
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
                slotProps={{
                  stack: { role: "listitem" },
                }}
                label={t("overview.fields.date", {
                  context: "label",
                })}
                value={formatDateToFullReadableString(values.appointment.start)}
                icon={<DateRange />}
                hiddenLabel
              />
            )}
            {values.appointment && (
              <DetailsItem
                slotProps={{
                  stack: { role: "listitem" },
                }}
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
                  slotProps={{
                    stack: { role: "listitem" },
                  }}
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
                slotProps={{
                  stack: { role: "listitem" },
                }}
                label={t("overview.fields.dateOfBirth", {
                  context: "label",
                })}
                value={formatDate(new Date(values.affectedPerson.dateOfBirth))}
                icon={<CakeOutlined />}
                hiddenLabel
              />
            )}
            {values.affectedPerson.contactAddress && (
              <DetailsItem
                slotProps={{
                  stack: { role: "listitem" },
                }}
                label={t("overview.fields.contactAddress", {
                  context: "label",
                })}
                value={
                  <Trans
                    i18nKey="overview.fields.contactAddress"
                    ns="officialMedicalService/appointment"
                    context="value"
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
                hiddenLabel
              />
            )}
            {values.affectedPerson.emailAddresses && (
              <DetailsItem
                slotProps={{
                  stack: { role: "listitem" },
                }}
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
                slotProps={{
                  stack: { role: "listitem" },
                }}
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
      {isDefined(buttonBar) && buttonBar}
    </Stack>
  );
}
