/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Edit } from "@mui/icons-material";
import { Chip, Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";

import { DetailsItem, EditButton } from "@eshg/lib-employee-portal";
import { DetailsList } from "@eshg/lib-portal";
import {
  ApiOmsAssessment,
  ApiOmsAssessmentResult,
} from "@eshg/official-medical-service-api";

import { useUpdateAssessmentResult } from "@/lib/businessModules/officialMedicalService/api/mutations/omsAssessmentApi";
import {
  formatAssessmentResult,
  useIsAssessmentEditable,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/helpers";
import { statusColorsAssessmentResult } from "@/lib/businessModules/officialMedicalService/shared/constants";
import { NAMES_ASSESSMENT_RESULT } from "@/lib/businessModules/officialMedicalService/shared/translations";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function AssessmentResultPanel({
  assessment,
}: {
  assessment: ApiOmsAssessment;
}) {
  const updateAssessmentResult = useUpdateAssessmentResult();
  const isAssessmentEditable = useIsAssessmentEditable();

  const resultTypes = [
    ApiOmsAssessmentResult.Positive,
    ApiOmsAssessmentResult.Negative,
    ApiOmsAssessmentResult.Undetermined,
  ];
  return (
    <InfoTile
      name="assessmentResult"
      title="Bewertung"
      controls={
        isAssessmentEditable(assessment) && (
          <Dropdown>
            <MenuButton
              slots={{ root: EditButton }}
              slotProps={{ root: { "aria-label": "Bewertung bearbeiten" } }}
            >
              <Edit />
            </MenuButton>
            <Menu>
              {resultTypes.map((result) => (
                <MenuItem
                  key={result}
                  onClick={() =>
                    updateAssessmentResult.mutateAsync({
                      id: assessment.id,
                      apiUpdateAssessmentResultRequest: { result },
                    })
                  }
                >
                  {NAMES_ASSESSMENT_RESULT[result]}
                </MenuItem>
              ))}
            </Menu>
          </Dropdown>
        )
      }
    >
      <DetailsList>
        <DetailsItem
          label="Ergebnis"
          value={
            <Chip
              color={
                assessment.assessmentResult
                  ? statusColorsAssessmentResult[assessment.assessmentResult]
                  : "warning"
              }
              size="md"
            >
              {formatAssessmentResult(assessment.assessmentResult)}
            </Chip>
          }
        />
      </DetailsList>
    </InfoTile>
  );
}
