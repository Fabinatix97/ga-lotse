/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";

import { useGetAssessment } from "@/lib/businessModules/officialMedicalService/api/queries/assessmentApi";
import { useGetProcedureDetails } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { AssessmentDetails } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/details/AssessmentDetails";
import { statusColorsAssessmentStatus } from "@/lib/businessModules/officialMedicalService/shared/constants";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { NAMES_ASSESSMENT_STATUS } from "@/lib/businessModules/officialMedicalService/shared/translations";

interface AssessmentDetailsProps {
  procedureId: string;
  assessmentId: string;
}

export function AssessmentDetailsPage({
  procedureId,
  assessmentId,
}: AssessmentDetailsProps) {
  const [{ data: procedure }, { data: assessment }] = useSuspenseQueries({
    queries: [
      useGetProcedureDetails(procedureId),
      useGetAssessment(assessmentId),
    ],
  });

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          backButton={
            <ToolbarBackButton
              href={routes.procedures.byId(procedureId).assessmentsOverview}
            />
          }
          title={`Schriftgut
            (${assessment.title})`}
          afterTitle={
            <Chip
              sx={{ ml: "auto", mt: "auto", mb: "auto", mr: 2 }}
              color={statusColorsAssessmentStatus[assessment.assessmentStatus]}
              size="md"
            >
              {NAMES_ASSESSMENT_STATUS[assessment.assessmentStatus]}
            </Chip>
          }
        />
      }
    >
      <MainContentLayout fullViewportHeight>
        <AssessmentDetails procedure={procedure} assessment={assessment} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
