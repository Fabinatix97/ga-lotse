/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box } from "@mui/joy";
import { isEmptyish } from "remeda";

import { EditButton } from "@eshg/lib-employee-portal";
import { InternalLinkButton, useNavigation } from "@eshg/lib-portal";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiOmsAssessmentDetails,
} from "@eshg/official-medical-service-api";

import { useIsAssessmentEditable } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/helpers";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function AssessmentContentPanel({
  procedure,
  assessment,
}: {
  procedure: ApiEmployeeOmsProcedureDetails;
  assessment: ApiOmsAssessmentDetails;
}) {
  const isAssessmentEditable = useIsAssessmentEditable();
  const { tryNavigate } = useNavigation();

  return (
    <InfoTile
      name="assessmentContent"
      title="Inhalt des Schriftguts"
      controls={
        isAssessmentEditable(assessment) && (
          <EditButton
            aria-label="Inhalt bearbeiten"
            onClick={() =>
              tryNavigate(
                routes.procedures
                  .byId(procedure.id)
                  .assessmentEditContent(assessment.id),
              )
            }
          />
        )
      }
    >
      {!isEmptyish(assessment.htmlContent) ? (
        <Box
          component="article"
          dangerouslySetInnerHTML={{ __html: assessment.htmlContent }}
        />
      ) : (
        isAssessmentEditable(assessment) && (
          <Box>
            <InternalLinkButton
              variant="plain"
              href={routes.procedures
                .byId(procedure.id)
                .assessmentEditContent(assessment.id)}
              endDecorator={<ArrowForwardIcon />}
            >
              Inhalt erstellen
            </InternalLinkButton>
          </Box>
        )
      )}
    </InfoTile>
  );
}
