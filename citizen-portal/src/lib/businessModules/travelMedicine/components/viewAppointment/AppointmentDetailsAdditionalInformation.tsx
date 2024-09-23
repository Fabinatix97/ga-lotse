/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetAppointmentDetailsResponse } from "@eshg/citizen-portal-api/travelMedicine";
import { Box, styled } from "@mui/joy";

import { theme } from "@/lib/baseModule/theme/theme";
import { AppointmentDetailsMedicalHistoryInformation } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentDetailsMedicalHistoryInformation";
import { useIsMobile } from "@/lib/businessModules/travelMedicine/shared/useIsMobile";
import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

const StyledList = styled("ul")({
  margin: 0,
  paddingLeft: "1.75rem",
  listStyleType: "disc",
});

const BOX_STYLE = {
  padding: "24px",
  margin: "0 24px",
  borderRadius: "lg",
  backgroundColor: theme.palette.background.level1,
};

const BOX_STYLE_MOBILE = {
  padding: "24px",
  borderRadius: 0,
  backgroundColor: theme.palette.background.level1,
};

interface AppointmentDetailsAdditionalInformationProps {
  appointmentDetails: ApiGetAppointmentDetailsResponse;
}

export function AppointmentDetailsAdditionalInformation(
  props: Readonly<AppointmentDetailsAdditionalInformationProps>,
) {
  const isMobile = useIsMobile();
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);

  return (
    !props.appointmentDetails.hasAccomplishedService && (
      <ContentSheet sx={{ padding: 0 }}>
        <ContentSheetTitle sx={{ padding: "24px 24px 0 24px" }}>
          {t("medicalHistoryPanel.title")}
        </ContentSheetTitle>
        <Box sx={isMobile ? BOX_STYLE_MOBILE : BOX_STYLE}>
          <AppointmentDetailsMedicalHistoryInformation
            isAnswered={props.appointmentDetails.isMedicalHistoryAnswered}
          />
        </Box>
        <InfoSection sx={{ padding: "0 24px 24px 24px" }}>
          <InfoSectionTitle>
            {t("medicalHistoryPanel.neededDocuments")}
          </InfoSectionTitle>
          <StyledList>
            <li>{t("medicalHistoryPanel.filledMedicalHistory")}</li>
            <li>{t("medicalHistoryPanel.vaccinationCertificate")}</li>
            <li>{t("medicalHistoryPanel.uBooklet")}</li>
            <li>{t("medicalHistoryPanel.medicalDocuments")}</li>
            <li>{t("medicalHistoryPanel.otherTools")}</li>
          </StyledList>
        </InfoSection>
      </ContentSheet>
    )
  );
}
