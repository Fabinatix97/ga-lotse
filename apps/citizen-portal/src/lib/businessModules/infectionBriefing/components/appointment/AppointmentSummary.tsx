/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  AccessTimeOutlined,
  CakeOutlined,
  DateRangeOutlined,
  DescriptionOutlined,
  LocationOnOutlined,
  MailOutlined,
  MarkEmailReadOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import {
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { useFormikContext } from "formik";
import { Trans, useTranslation } from "react-i18next";

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";
import {
  Alert,
  DetailsColumn,
  DetailsList,
  formatDate,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
  formatTime,
} from "@eshg/lib-portal";

import { useDepartmentInfo } from "@/lib/businessModules/infectionBriefing/api/queries/publicCitizenApi";
import { AppointmentFormData } from "@/lib/businessModules/infectionBriefing/components/appointment/AppointmentStepper";
import { BookAppointmentButtonBar } from "@/lib/businessModules/infectionBriefing/components/appointment/BookAppointmentButtonBar";
import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/infectionBriefing/shared/components/FormSheet";
import { useLocale } from "@/lib/i18n/useLocale";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import { ThreeColumnGrid } from "@/lib/shared/components/layout/grid";

export function AppointmentSummary() {
  const { t } = useTranslation("infectionBriefing/forms");
  const { data: departmentInfo } = useDepartmentInfo();
  const { values } = useFormikContext<AppointmentFormData>();

  return (
    <ThreeColumnGrid
      contentLeft={
        <FormSheet>
          <FormSheetTitle>
            {t("summary.appointment_information.title")}
          </FormSheetTitle>
          <Alert
            title={t(
              "summary.appointment_information.importantInformationTitle",
            )}
            color="primary"
            message={t(
              "summary.appointment_information.importantInformationBody",
            )}
            messageComponent="span"
          />
          <Typography>
            <Trans
              i18nKey="infectionBriefing/forms:summary.appointment_information.body"
              components={{
                bold: <strong />,
              }}
            />
          </Typography>
          <Typography>
            {t("summary.appointment_information.necessaryDocuments")}
          </Typography>
          <ListItem>
            <ListItemDecorator>•&nbsp;</ListItemDecorator>
            <ListItemContent>
              <Trans
                i18nKey="infectionBriefing/forms:summary.appointment_information.listItemIdCard"
                components={{
                  bold: <strong />,
                }}
              />
            </ListItemContent>
          </ListItem>
          <Typography>
            {t("summary.appointment_information.closingGreeting")}
          </Typography>
          <Typography>
            {t("summary.appointment_information.healthDepartment")}
          </Typography>
        </FormSheet>
      }
      contentRight={
        <DetailsSection departmentInfo={departmentInfo} values={values} />
      }
      sidePanel={<BookAppointmentButtonBar />}
    />
  );
}

function DetailsSection({
  departmentInfo,
  values,
}: {
  departmentInfo: ApiGetDepartmentInfoResponse;
  values: AppointmentFormData;
}) {
  const { t } = useTranslation("infectionBriefing/forms");
  const locale = useLocale();

  return (
    <FormSheet>
      <FormSheetTitle>{t("summary.details.title")}</FormSheetTitle>
      <DetailsList>
        <DetailsColumn sx={{ gap: byBreakpoint({ mobile: 1, desktop: 2 }) }}>
          <DetailsItem
            label={t("summary.details.appointmentType", {
              context: "label",
            })}
            hiddenLabel
            value={
              values.appointmentType === "INFECTION_BRIEFING_NEW"
                ? t("common.newInfectionBriefing")
                : t("common.replacementInfectionBriefing")
            }
            icon={<DescriptionOutlined />}
          />
          <DetailsItem
            label={t("summary.details.location", {
              context: "label",
            })}
            hiddenLabel
            value={
              <div>
                {departmentInfo.name}
                <br />
                {formatStreetAndHouseNumber(departmentInfo)}
                <br />
                {formatPostalCodeAndCity(departmentInfo)}
              </div>
            }
            icon={<LocationOnOutlined />}
          />
          <DetailsItem
            label={t("summary.details.date", {
              context: "label",
            })}
            hiddenLabel
            value={
              values.appointment?.start &&
              formatDate(values.appointment.start, locale.code)
            }
            icon={<DateRangeOutlined />}
          />
          <DetailsItem
            label={t("summary.details.time", {
              context: "label",
            })}
            hiddenLabel
            value={
              values.appointment?.start &&
              `${formatTime(values.appointment.start, locale.code)} Uhr`
            }
            icon={<AccessTimeOutlined />}
          />
          <DetailsItem
            label={t("summary.details.name")}
            hiddenLabel
            value={`${values.affectedPerson.firstName} ${values.affectedPerson.lastName}`}
            icon={<PersonOutlined />}
          />
          <DetailsItem
            label={t("summary.details.dateOfBirth")}
            hiddenLabel
            value={values.affectedPerson.dateOfBirth.toString()}
            icon={<CakeOutlined />}
          />
          <DetailsItem
            label={t("summary.details.email")}
            hiddenLabel
            value={values.affectedPerson.email}
            icon={<MailOutlined />}
          />
          <DetailsItem
            label={t("summary.details.emailConfirmationLink")}
            hiddenLabel
            value={t("summary.details.emailConfirmationLink")}
            icon={<MarkEmailReadOutlined />}
          />
        </DetailsColumn>
      </DetailsList>
    </FormSheet>
  );
}
