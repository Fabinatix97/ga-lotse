/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Check, CloseOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionGrid,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";

export function AppointmentDetailsMedicalHistoryInformation({
  isAnswered,
}: Readonly<{ isAnswered: boolean }>) {
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);

  return (
    <InfoSectionGrid>
      <InfoSection
        icon={
          isAnswered ? (
            <Check color="success" />
          ) : (
            <CloseOutlined color="danger" />
          )
        }
      >
        <InfoSectionTitle>
          {t("medicalHistoryPanel.medicalHistorySheet")}
        </InfoSectionTitle>
        <Typography data-testid="medical-history-state">
          {isAnswered
            ? t("medicalHistoryPanel.answered")
            : t("medicalHistoryPanel.notAnswered")}
        </Typography>
      </InfoSection>
      {!isAnswered && (
        <Button sx={{ marginTop: 1 }} fullWidth>
          {t("medicalHistoryPanel.answerNow")}
        </Button>
      )}
    </InfoSectionGrid>
  );
}
