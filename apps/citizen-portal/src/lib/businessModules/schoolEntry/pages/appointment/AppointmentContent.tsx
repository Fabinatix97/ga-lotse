/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AccessTimeOutlined,
  CakeOutlined,
  Check,
  CloseOutlined,
  DateRangeOutlined,
  FmdGoodOutlined,
  MedicalServicesOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { Box, Typography, styled } from "@mui/joy";
import { formatDuration } from "date-fns";
import { de } from "date-fns/locale";

import {
  InternalLinkButton,
  formatDate,
  formatPersonName,
  formatTime,
} from "@eshg/lib-portal";

import { theme } from "@/lib/baseModule/theme/theme";
import { SchoolEntryProcedure } from "@/lib/businessModules/schoolEntry/api/models/SchoolEntryProcedure";
import { useCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
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
import {
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@/lib/shared/formatters/address";

const StyledList = styled("ul")({
  margin: 0,
  paddingLeft: "1.75rem",
  listStyleType: "disc",
});

const BOX_STYLE = {
  padding: "24px",
  borderRadius: "lg",
  backgroundColor: theme.palette.background.level1,
};

interface AppointmentContentProps {
  procedure: SchoolEntryProcedure;
}

export function AppointmentContent(props: AppointmentContentProps) {
  const { t } = useTranslation(["schoolEntry/appointment"]);

  const procedure = props.procedure;
  const childName = formatPersonName(procedure.child);
  const appointmentDate = formatDate(procedure.appointmentStart);
  const appointmentTime = formatTime(procedure.appointmentStart);
  const appointmentDuration = formatDuration(procedure.appointmentDuration, {
    locale: de,
  });
  const dateOfBirth = formatDate(procedure.child.dateOfBirth);
  const allowCitizenAnamnesis = procedure.allowCitizenAnamnesis;

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("details.title")}</ContentSheetTitle>
        <InfoSectionGrid>
          <InfoSection icon={<PersonOutlined />}>
            <InfoSectionTitle>{t("details.name")}</InfoSectionTitle>
            <Typography>{childName}</Typography>
          </InfoSection>
          <InfoSection icon={<CakeOutlined />}>
            <InfoSectionTitle>{t("details.birthday")}</InfoSectionTitle>
            <Typography>{dateOfBirth}</Typography>
          </InfoSection>
          <InfoSection icon={<MedicalServicesOutlined />}>
            <InfoSectionTitle>{t("details.medicalService")}</InfoSectionTitle>
            <Typography>{t("details.schoolEntryExamination")}</Typography>
          </InfoSection>
          <InfoSection icon={<DateRangeOutlined />}>
            <InfoSectionTitle>{t("details.date")}</InfoSectionTitle>
            <Typography>{appointmentDate}</Typography>
          </InfoSection>
          <InfoSection icon={<AccessTimeOutlined />}>
            <InfoSectionTitle>{t("details.time")}</InfoSectionTitle>
            <Typography>
              {appointmentTime} {t("details.clock")}
              <br />
              {t("details.duration")} {appointmentDuration}
            </Typography>
          </InfoSection>
          <InfoSection icon={<FmdGoodOutlined />}>
            <InfoSectionTitle>{t("details.place")}</InfoSectionTitle>
            <Typography>
              {props.procedure.appointmentAddress.name}
              <br />
              {formatStreetAndHouseNumber(props.procedure.appointmentAddress)}
              <br />
              {formatPostalCodeAndCity(props.procedure.appointmentAddress)}
            </Typography>
          </InfoSection>
        </InfoSectionGrid>
      </ContentSheet>
      <ContentSheet>
        <ContentSheetTitle>{t("preparations")}</ContentSheetTitle>
        <Box sx={BOX_STYLE}>
          {allowCitizenAnamnesis ? (
            <CitizenAnamnesisAllowed />
          ) : (
            <CitizenAnamnesisNotAllowed />
          )}
        </Box>
        <InfoSection>
          <InfoSectionTitle>{t("required.title")}</InfoSectionTitle>
          <StyledList>
            <li>{t("required.anamnesis")}</li>
            <li>{t("required.vaccinationCard")}</li>
            <li>{t("required.medicalRecords")}</li>
            <li>{t("required.additionalDocuments")}</li>
            <li>{t("required.additionalAids")}</li>
          </StyledList>
        </InfoSection>
      </ContentSheet>
    </GridColumnStack>
  );
}

function CitizenAnamnesisAllowed() {
  const { t } = useTranslation(["schoolEntry/appointment"]);

  const citizenRoutes = useCitizenRoutes();
  return (
    <InfoSectionGrid>
      <InfoSection icon={<CloseOutlined color="danger" />}>
        <InfoSectionTitle>{t("anamnesis.title")}</InfoSectionTitle>
        <Typography>{t("anamnesis.notSubmitted")}</Typography>
      </InfoSection>
      <InternalLinkButton
        href={citizenRoutes.appointment.citizenAnamnesis}
        sx={{ marginTop: 1 }}
        fullWidth
      >
        {t("anamnesis.fillIn")}
      </InternalLinkButton>
    </InfoSectionGrid>
  );
}

function CitizenAnamnesisNotAllowed() {
  const { t } = useTranslation(["schoolEntry/appointment"]);

  return (
    <InfoSectionGrid>
      <InfoSection icon={<Check color="success" />}>
        <InfoSectionTitle>{t("anamnesis.title")}</InfoSectionTitle>
        <Typography>{t("anamnesis.submitted")}</Typography>
      </InfoSection>
    </InfoSectionGrid>
  );
}
