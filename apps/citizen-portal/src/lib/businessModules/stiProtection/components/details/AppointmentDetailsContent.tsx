/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  AccessTimeOutlined,
  CakeOutlined,
  ChatBubbleOutlineOutlined,
  DateRangeOutlined,
  LaptopMacOutlined,
  MedicalServicesOutlined,
} from "@mui/icons-material";
import { Typography } from "@mui/joy";

import {
  ExternalLink,
  durationBetweenDatesInMinutes,
  formatAppointmentTime,
  formatDateToYear,
} from "@eshg/lib-portal";
import { ApiConcern } from "@eshg/sti-protection-api";

import { useAnonymousIdentificationDocumentQuery } from "@/lib/businessModules/stiProtection/api/queries/citizenApi";
import { useDepartmentInfo } from "@/lib/businessModules/stiProtection/api/queries/publicCitizenApi";
import { useCitizenProcedure } from "@/lib/businessModules/stiProtection/components/appointment/CitizenProcedureContext";
import { DownloadDocumentCard } from "@/lib/businessModules/stiProtection/components/shared/DownloadDocumentCard";
import { MedicalHistoryCard } from "@/lib/businessModules/stiProtection/components/shared/MedicalHistoryCard";
import { TranslatedList } from "@/lib/businessModules/stiProtection/components/shared/TranslatedList";
import {
  useCitizenRoutes,
  useConcernedCitizenRoutes,
} from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/lib/i18n/useLocale";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import {
  InfoSection,
  InfoSectionGrid,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";
import { ScopedInternalLink } from "@/lib/shared/components/scopedLinks";
import { DepartmentInfoProps } from "@/lib/shared/types";

export function AppointmentDetailsContent() {
  const { appointment, concern, medicalHistorySubmitted } =
    useCitizenProcedure();
  const { t } = useTranslation("stiProtection/appointmentInfo");
  const citizenRoutes = useConcernedCitizenRoutes(concern);
  const document = useAnonymousIdentificationDocumentQuery();

  const hasUpcomingAppointment = appointment !== undefined;

  return (
    <GridColumnStack>
      {hasUpcomingAppointment ? (
        <ContentSheet>
          <ContentSheetTitle>{t("main.title")}</ContentSheetTitle>
          <MedicalHistoryCard
            title={t("main.medical_history_title")}
            fulfilledLabel={t("main.medical_history_fulfilled")}
            unfulfilledLabel={t("main.medical_history_unfulfilled")}
            buttonLabel={t("main.medical_history_button")}
            status={medicalHistorySubmitted}
            href={citizenRoutes.personalArea.anamnesis}
          />
          <DownloadDocumentCard
            documentTitle={t("main.auth_document_title")}
            downloadLabel={t("main.download_button")}
            downloadedLabel={t("main.downloaded_button")}
            onClick={() => document.download()}
          />
          <TranslatedList
            baseKey="main"
            headingKey="important_info_to_heading"
            listKey="important_info_to_list"
            localePath="stiProtection/appointmentInfo"
          />
        </ContentSheet>
      ) : null}
    </GridColumnStack>
  );
}

export function Information() {
  const { person, appointment, concern } = useCitizenProcedure();
  const { t } = useTranslation("stiProtection/appointmentInfo");
  const { code } = useLocale();
  const { data: departmentInfo } = useDepartmentInfo(concern);
  const hasUpcomingAppointment = appointment !== undefined;
  return (
    <ContentSheet>
      <ContentSheetTitle>{t("info.title")}</ContentSheetTitle>
      <InfoSectionGrid>
        <YearOfBirthSection yearOfBirth={person.yearOfBirth} />
        <ServiceSection concern={concern} />
        {hasUpcomingAppointment ? (
          <AppointmentDateSection date={appointment.start} locale={code} />
        ) : null}
        {hasUpcomingAppointment ? (
          <AppointmentTimeSection
            time={appointment.start}
            duration={durationBetweenDatesInMinutes(
              appointment.start,
              appointment.end,
            )}
            locale={code}
          />
        ) : null}
        <AddressSection department={departmentInfo} />
        <InternetSection concern={concern} />
        <ContactSection department={departmentInfo} />
      </InfoSectionGrid>
    </ContentSheet>
  );
}

function YearOfBirthSection({ yearOfBirth }: { yearOfBirth: string }) {
  const { t } = useTranslation("stiProtection/appointmentInfo");
  return (
    <InfoSection icon={<CakeOutlined />}>
      <InfoSectionTitle>
        {t("info.year_of_birth_section.title")}
      </InfoSectionTitle>
      <Typography>{yearOfBirth}</Typography>
    </InfoSection>
  );
}

function ServiceSection({ concern }: { concern: ApiConcern }) {
  const { t } = useTranslation("stiProtection/appointmentInfo");
  return (
    <InfoSection icon={<MedicalServicesOutlined />}>
      <InfoSectionTitle>{t("info.service_section.title")}</InfoSectionTitle>
      <Typography>{t(`info.service_section.${concern}`)}</Typography>
    </InfoSection>
  );
}

function AppointmentDateSection({
  date,
  locale,
}: {
  date: Date;
  locale: string;
}) {
  const { t } = useTranslation("stiProtection/appointmentInfo");
  return (
    <InfoSection icon={<DateRangeOutlined />}>
      <InfoSectionTitle>
        {t("info.appointment_date_section.title")}
      </InfoSectionTitle>
      <Typography>{formatDateToYear(date, locale)}</Typography>
    </InfoSection>
  );
}

function AppointmentTimeSection({
  time,
  duration,
  locale,
}: {
  time: Date;
  duration: number;
  locale: string;
}) {
  const { t } = useTranslation("stiProtection/appointmentInfo");
  return (
    <InfoSection icon={<AccessTimeOutlined />}>
      <InfoSectionTitle>
        {t("info.appointment_time_section.title")}
      </InfoSectionTitle>
      <Typography>
        {t("info.appointment_time_section.time", {
          time: formatAppointmentTime(time, locale),
        })}
      </Typography>
      <Typography>
        {t("info.appointment_time_section.duration", { duration: duration })}
      </Typography>
    </InfoSection>
  );
}

function InternetSection({ concern }: { concern?: ApiConcern }) {
  const { t } = useTranslation("stiProtection/appointmentInfo");
  const { sexWork, stiConsultation } = useCitizenRoutes();
  const ref =
    concern === ApiConcern.SexWork ? sexWork.index : stiConsultation.index;
  return (
    <InfoSection icon={<LaptopMacOutlined />}>
      <InfoSectionTitle>{t("info.internet_section.title")}</InfoSectionTitle>
      <ScopedInternalLink href="/">
        {t("info.internet_section.health_department")}
      </ScopedInternalLink>
      <ScopedInternalLink href={ref}>
        {t("info.internet_section.opening_hours")}
      </ScopedInternalLink>
    </InfoSection>
  );
}

function ContactSection({ department }: DepartmentInfoProps) {
  const { t } = useTranslation("stiProtection/appointmentInfo");
  return (
    <InfoSection icon={<ChatBubbleOutlineOutlined />}>
      <InfoSectionTitle>{t("info.contact_section.title")}</InfoSectionTitle>
      <Typography>
        {t("info.contact_section.phone_number", {
          phoneNumber: department.phoneNumber,
        })}
      </Typography>
      <Typography>
        {t("info.contact_section.email")}
        <ExternalLink href={`mailto:${department.email}`}>
          {department.email}
        </ExternalLink>
      </Typography>
    </InfoSection>
  );
}
