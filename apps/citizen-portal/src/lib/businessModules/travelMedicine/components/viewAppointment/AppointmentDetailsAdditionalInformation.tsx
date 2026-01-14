/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, styled } from "@mui/joy";

import { useIsMobile } from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiGetAppointmentDetailsResponse,
} from "@eshg/travel-medicine-api";

import { theme } from "@/lib/baseModule/theme/theme";
import { AppointmentDetailsInformationStatementList } from "@/lib/businessModules/travelMedicine/components/viewAppointment/ApointmentDetailsInformationStatementList";
import { AppointmentDetailsMedicalHistoryInformation } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentDetailsMedicalHistoryInformation";
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

  function isCancelled() {
    return (
      props.appointmentDetails.summaryDto.appointmentBookingType ===
      ApiAppointmentBookingType.Cancelled
    );
  }

  return (
    !props.appointmentDetails.hasAccomplishedService &&
    !isCancelled() && (
      <ContentSheet sx={{ padding: 0 }}>
        <ContentSheetTitle sx={{ padding: "24px 24px 0 24px" }}>
          {t("medicalHistoryPanel.title")}
        </ContentSheetTitle>
        <Box sx={isMobile ? BOX_STYLE_MOBILE : BOX_STYLE}>
          <AppointmentDetailsMedicalHistoryInformation
            citizenHasAnswered={
              props.appointmentDetails.medicalHistoryCitizenHasAnswered
            }
          />
        </Box>
        {props.appointmentDetails.informationStatementSummaries.length > 0 && (
          <Box sx={isMobile ? BOX_STYLE_MOBILE : BOX_STYLE}>
            <AppointmentDetailsInformationStatementList
              informationStatementSummaries={
                props.appointmentDetails.informationStatementSummaries
              }
            />
          </Box>
        )}
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
