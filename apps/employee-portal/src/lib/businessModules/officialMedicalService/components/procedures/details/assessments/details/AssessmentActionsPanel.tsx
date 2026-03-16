/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { isEmptyish } from "remeda";

import {
  InformationSheet,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiOmsAssessmentDetails,
  ApiOmsAssessmentResult,
  ApiOmsAssessmentStatus,
} from "@eshg/official-medical-service-api";

import {
  useUpdateAssessmentStatusToFinished,
  useUpdateAssessmentStatusToOpen,
  useUpdateAssessmentStatusToPublished,
} from "@/lib/businessModules/officialMedicalService/api/mutations/omsAssessmentApi";
import { useIsAssessmentOwner } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/helpers";

export function AssessmentActionsPanel({
  assessment,
}: {
  procedure: ApiEmployeeOmsProcedureDetails;
  assessment: ApiOmsAssessmentDetails;
}) {
  const isAssessmentOwner = useIsAssessmentOwner();
  const updateAssessmentStatusToFinished =
    useUpdateAssessmentStatusToFinished();
  const updateAssessmentStatusToOpen = useUpdateAssessmentStatusToOpen();
  const updateAssessmentStatusToPublished =
    useUpdateAssessmentStatusToPublished();
  const { openConfirmationDialog } = useConfirmationDialog();
  const snackbar = useSnackbar();

  const owner = isAssessmentOwner(assessment);
  const status = assessment.assessmentStatus;
  const canFinishAssessment =
    owner &&
    status === ApiOmsAssessmentStatus.Open &&
    !isEmptyish(assessment.jsonContent) &&
    assessment.recipientType &&
    assessment.assessmentResult !== ApiOmsAssessmentResult.Undetermined;

  return (
    <InformationSheet>
      {!isEmptyish(assessment.jsonContent) && (
        <Button
          variant="outlined"
          onClick={() => snackbar.notification("TODO: ISSUE-10556")}
        >
          {status === ApiOmsAssessmentStatus.Open
            ? "Vorschau PDF erstellen"
            : "PDF erstellen"}
        </Button>
      )}
      {canFinishAssessment && (
        <Button
          variant="soft"
          onClick={() =>
            openConfirmationDialog({
              title: "Schriftgut Fertig",
              description:
                "Schriftgut kann jederzeit wider geöffnet und bearbeitet werden.",
              confirmLabel: "Abschließen",
              onConfirm: () =>
                updateAssessmentStatusToFinished.mutateAsync(assessment.id),
            })
          }
        >
          Schriftgut Fertig
        </Button>
      )}
      {owner && status === ApiOmsAssessmentStatus.Finished && (
        <Button
          variant="soft"
          onClick={() =>
            updateAssessmentStatusToOpen.mutateAsync(assessment.id)
          }
        >
          Schriftgut öffnen
        </Button>
      )}
      {owner && status === ApiOmsAssessmentStatus.Finished && (
        <Button
          onClick={() =>
            openConfirmationDialog({
              title: "Schriftgut Fertig - Übermittelt",
              description: "Schriftgut kann nicht mehr bearbteitet werden.",
              confirmLabel: "Abschließen",
              onConfirm: () =>
                updateAssessmentStatusToPublished.mutateAsync(assessment.id),
            })
          }
        >
          Schriftgut Fertig - Übermittelt
        </Button>
      )}
    </InformationSheet>
  );
}
