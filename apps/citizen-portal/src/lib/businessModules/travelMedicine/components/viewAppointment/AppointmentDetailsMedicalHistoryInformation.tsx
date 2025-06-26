/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Check, CloseOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/joy";

import { useIdContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/IdContext";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionGrid,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

interface AppointmentDetailsMedicalHistoryInformationProps {
  citizenHasAnswered: boolean;
}

export function AppointmentDetailsMedicalHistoryInformation(
  props: Readonly<AppointmentDetailsMedicalHistoryInformationProps>,
) {
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);
  const router = useScopedRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();
  const { procedureId, procedureStepId } = useIdContext();

  function navigateToMedicalHistory() {
    const url = `${citizenRoutes.viewAppointment.details.medicalHistory(accessCode)}?procedureId=${procedureId}&procedureStepId=${procedureStepId}`;
    router.push(url);
  }

  return (
    <InfoSectionGrid>
      <InfoSection
        icon={
          props.citizenHasAnswered ? (
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
          {props.citizenHasAnswered
            ? t("medicalHistoryPanel.answered")
            : t("medicalHistoryPanel.notAnswered")}
        </Typography>
      </InfoSection>
      {!props.citizenHasAnswered && (
        <Button
          sx={{ marginTop: 1 }}
          fullWidth
          data-testid="medical-history-button"
          onClick={navigateToMedicalHistory}
        >
          {t("medicalHistoryPanel.answerNow")}
        </Button>
      )}
    </InfoSectionGrid>
  );
}
