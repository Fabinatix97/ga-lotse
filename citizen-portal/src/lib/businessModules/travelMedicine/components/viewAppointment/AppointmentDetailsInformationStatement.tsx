/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInformationStatementSummary } from "@eshg/citizen-portal-api/travelMedicine";
import { Check, CloseOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";

import { useIdContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/IdContext";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import {
  InfoSection,
  InfoSectionGrid,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

interface AppointmentDetailsInformationStatementProp {
  summary: ApiInformationStatementSummary;
}
export function AppointmentDetailsInformationStatement(
  props: Readonly<AppointmentDetailsInformationStatementProp>,
) {
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();
  const { procedureId, procedureStepId } = useIdContext();

  function navigateToInformationStatement() {
    const url = `${citizenRoutes.viewAppointment.details.informationStatement(accessCode)}?statementId=${props.summary.id}&procedureId=${procedureId}&procedureStepId=${procedureStepId}`;
    router.push(url);
  }

  return (
    <InfoSectionGrid data-testid="information-statement-entry">
      <InfoSection
        icon={
          props.summary.citizenHasAnswered ? (
            <Check color="success" />
          ) : (
            <CloseOutlined color="danger" />
          )
        }
      >
        <InfoSectionTitle data-testid="information-statement-titel">
          {props.summary.title}
        </InfoSectionTitle>
        <Typography data-testid="information-statement-state">
          {props.summary.citizenHasAnswered
            ? t("informationStatementPanel.answered")
            : t("informationStatementPanel.notAnswered")}
        </Typography>
      </InfoSection>
      {!props.summary.citizenHasAnswered && (
        <Button
          sx={{ marginTop: 1 }}
          fullWidth
          onClick={navigateToInformationStatement}
        >
          {t("informationStatementPanel.answerNow")}
        </Button>
      )}
    </InfoSectionGrid>
  );
}
