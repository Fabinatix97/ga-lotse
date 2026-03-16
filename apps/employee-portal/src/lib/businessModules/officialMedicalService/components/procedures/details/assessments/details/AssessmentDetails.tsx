/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack } from "@mui/joy";
import { isEmptyish } from "remeda";

import {
  ApiEmployeeOmsProcedureDetails,
  ApiOmsAssessmentDetails,
} from "@eshg/official-medical-service-api";

import { AssessmentActionsPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/details/AssessmentActionsPanel";
import { AssessmentContentPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/details/AssessmentContentPanel";
import { AssessmentInfoPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/details/AssessmentInfoPanel";
import { AssessmentRecipientPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/details/AssessmentRecipientPanel";
import { AssessmentResultPanel } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/details/AssessmentResultPanel";
import { DetailsGrid } from "@/lib/businessModules/officialMedicalService/shared/DetailsGrid";

const SPACING = { xxs: 2, sm: 3, md: 3, xxl: 3 };

interface AssessmentDetailsProps {
  procedure: ApiEmployeeOmsProcedureDetails;
  assessment: ApiOmsAssessmentDetails;
}

export function AssessmentDetails({
  procedure,
  assessment,
}: AssessmentDetailsProps) {
  return (
    <DetailsGrid data-testid="procedure-detail-page">
      <Grid xs={9}>
        <Stack spacing={SPACING}>
          <AssessmentInfoPanel procedure={procedure} assessment={assessment} />
          <AssessmentContentPanel
            procedure={procedure}
            assessment={assessment}
          />
        </Stack>
      </Grid>
      <Grid xs={3}>
        <Stack spacing={SPACING}>
          <AssessmentRecipientPanel
            procedure={procedure}
            assessment={assessment}
          />
          <AssessmentResultPanel assessment={assessment} />
          {!isEmptyish(assessment.jsonContent) && (
            <AssessmentActionsPanel
              procedure={procedure}
              assessment={assessment}
            />
          )}
        </Stack>
      </Grid>
    </DetailsGrid>
  );
}
