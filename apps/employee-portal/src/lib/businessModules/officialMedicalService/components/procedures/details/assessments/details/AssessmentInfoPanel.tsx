/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import {
  DetailsItem,
  EditButton,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import { DetailsColumn, DetailsList, formatDate } from "@eshg/lib-portal";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiOmsAssessment,
} from "@eshg/official-medical-service-api";

import { useEditAssessmentInfoSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/details/EditAssessmentInfoSidebar";
import {
  formatUser,
  useIsAssessmentEditable,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/helpers";
import { NAMES_ASSESSMENT_TYPE } from "@/lib/businessModules/officialMedicalService/shared/translations";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function AssessmentInfoPanel({
  assessment,
}: {
  procedure: ApiEmployeeOmsProcedureDetails;
  assessment: ApiOmsAssessment;
}) {
  const editAssessmentInfoSidebar = useEditAssessmentInfoSidebar();
  const isAssessmentEditable = useIsAssessmentEditable();

  return (
    <InfoTile
      name="assessmentInfo"
      title="Angaben"
      controls={
        isAssessmentEditable(assessment) && (
          <EditButton
            aria-label="Angaben bearbeiten"
            onClick={() => editAssessmentInfoSidebar.open({ assessment })}
          />
        )
      }
    >
      <DetailsList>
        <Stack
          direction={{ md: "row" }}
          gap={3}
          divider={<ResponsiveDivider breakpoint="md" />}
          width="100%"
        >
          <DetailsColumn
            sx={{
              flexGrow: 1,
              maxWidth: (theme) => ({
                md: `calc(100%/3 - 2 * ${theme.spacing(2)})`,
              }),
            }}
          >
            <DetailsItem label="Bezeichnung" value={assessment.title} />
            <DetailsItem
              label="Dokumentenart"
              value={NAMES_ASSESSMENT_TYPE[assessment.assessmentType]}
            />
          </DetailsColumn>
          <DetailsColumn
            sx={{
              flexGrow: 1,
              maxWidth: (theme) => ({
                md: `calc(100%/3 - 2 * ${theme.spacing(2)})`,
              }),
            }}
          >
            <DetailsItem
              label="Erstelldatum"
              value={formatDate(assessment.created)}
            />
            <DetailsItem
              label="Fertigstelldatum"
              value={formatDate(assessment.finished)}
            />
          </DetailsColumn>
          <DetailsColumn
            sx={{
              flexGrow: 1,
              maxWidth: (theme) => ({
                md: `calc(100%/3 - 2 * ${theme.spacing(2)})`,
              }),
            }}
          >
            <DetailsItem
              label="Bearbeiter:in"
              value={formatUser(assessment.editor)}
            />
          </DetailsColumn>
        </Stack>
      </DetailsList>
    </InfoTile>
  );
}
