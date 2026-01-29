/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  AccessTimeOutlined,
  ArrowRightAltOutlined,
  ChatBubbleOutlineOutlined,
  ComputerOutlined,
  DateRangeOutlined,
  ErrorOutline,
  LocationOnOutlined,
  MedicalServicesOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { Stack, Typography, styled } from "@mui/joy";
import { formatDate } from "date-fns";
import { useTranslation } from "react-i18next";

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";
import {
  ExternalLink,
  durationBetweenDatesInMinutes,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@eshg/lib-portal";

import { useDepartmentInfo } from "@/lib/businessModules/prostituteProtection/api/queries/publicCitizenApi";
import { ButtonBar } from "@/lib/businessModules/prostituteProtection/components/appointment/ButtonBar";
import { useLocale } from "@/lib/i18n/useLocale";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import { InfoSectionGrid } from "@/lib/shared/components/infoSection";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";

import { AppointmentFormData } from "./AppointmentStepper";

interface AppointmentSummaryProps {
  values: AppointmentFormData;
  resetValues: () => void;
}

export function AppointmentSummary({
  values,
  resetValues,
}: AppointmentSummaryProps) {
  const { t } = useTranslation("prostituteProtection/appointmentInfo");
  const { data: departmentInfo } = useDepartmentInfo();

  return (
    <PageContent>
      <PageTitle>{t("page_title")}</PageTitle>
      <TwoColumnGrid
        content={
          <Stack gap={3}>
            <ImportantNotice />
            <InfoSection />
            <DetailsSection departmentInfo={departmentInfo} formData={values} />
          </Stack>
        }
        sidePanel={<ButtonBar onResetClick={resetValues} />}
      />
    </PageContent>
  );
}

function ImportantNotice() {
  const { t } = useTranslation("prostituteProtection/appointmentInfo");

  return (
    <ContentSheet>
      <Stack gap={2} direction="row">
        <ErrorOutline color="danger" size="lg" />
        <ContentSheetTitle>{t("important_notice.title")}</ContentSheetTitle>
      </Stack>
      <Stack gap={2}>
        <Typography level="body-md">
          {t("important_notice.description")}
        </Typography>
        <Typography level="body-md">
          {t("important_notice.reschedule")}
        </Typography>
      </Stack>
    </ContentSheet>
  );
}

function InfoSection() {
  const { t } = useTranslation("prostituteProtection/appointmentInfo");

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("preparations.title")}</ContentSheetTitle>
      <Typography level="title-md">{t("preparations.subtitle")}</Typography>
      <Stack gap={2}>
        <InfoItem level="body-md">{t("preparations.documents_info")}</InfoItem>
        <InfoItem level="body-md">{t("preparations.alias_info")}</InfoItem>
      </Stack>
    </ContentSheet>
  );
}

function DetailsSection({
  departmentInfo,
  formData,
}: {
  departmentInfo: ApiGetDepartmentInfoResponse;
  formData: AppointmentFormData;
}) {
  const { t } = useTranslation("prostituteProtection/appointmentInfo");
  const locale = useLocale();

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("details.title")}</ContentSheetTitle>
      <InfoSectionGrid>
        <DetailsItem
          label={t("details.appointment_type", {
            context: "label",
          })}
          value={t("details.consultation_name")}
          icon={<MedicalServicesOutlined />}
        />
        <DetailsItem
          label={t("details.alias", {
            context: "label",
          })}
          value={formData.alias}
          icon={<PersonOutlined />}
        />
        <DetailsItem
          label={t("details.date", {
            context: "label",
          })}
          value={
            formData.appointment?.start &&
            formatDate(formData.appointment.start, "EEEE, d. MMMM y", {
              locale,
            })
          }
          icon={<DateRangeOutlined />}
        />
        <DetailsItem
          label={t("details.time.title", {
            context: "label",
          })}
          value={
            formData?.appointment?.start && (
              <>
                {formData.appointment?.start &&
                  t("details.time.start", {
                    time: formatDate(formData.appointment.start, "HH:mm", {
                      locale,
                    }),
                  })}
                <br />
                {t("details.time.duration", {
                  duration:
                    formData.appointment?.start &&
                    durationBetweenDatesInMinutes(
                      formData.appointment?.start,
                      formData.appointment?.end,
                    ),
                })}
              </>
            )
          }
          icon={<AccessTimeOutlined />}
        />
        <DetailsItem
          label={t("details.location", {
            context: "label",
          })}
          value={
            <>
              {departmentInfo.name}
              <br />
              {formatStreetAndHouseNumber(departmentInfo)}
              <br />
              {formatPostalCodeAndCity(departmentInfo)}
            </>
          }
          icon={<LocationOnOutlined />}
        />
        <DetailsItem
          label={t("details.links.title", {
            context: "label",
          })}
          value={
            <ExternalLink
              key="internet"
              sx={{
                justifyContent: "space-between",
                wordBreak: "break-all",
              }}
              href={`https://${departmentInfo.homepage}`}
              endDecorator={<ArrowRightAltOutlined />}
            >
              {t("details.links.publicHealth_department")}
            </ExternalLink>
          }
          icon={<ComputerOutlined />}
        />
        <DetailsItem
          label={t("contact_section.title", {
            context: "label",
          })}
          value={
            <>
              {t("contact_section.phone_number", {
                phoneNumber: departmentInfo.phoneNumber,
              })}
              <br />
              {t("contact_section.eMail")}
              <br />
              <ExternalLink href={`mailto:${departmentInfo.email}`}>
                {departmentInfo.email}
              </ExternalLink>
            </>
          }
          icon={<ChatBubbleOutlineOutlined />}
        />
      </InfoSectionGrid>
    </ContentSheet>
  );
}

const InfoItem = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  "&::before": {
    content: '""',
    display: "inline-block",
    width: 4,
    height: 4,
    backgroundColor: theme.palette.common.black,
    borderRadius: "50%",
    marginRight: 8,
    marginTop: "0.6em",
    flexShrink: 0,
  },
}));
