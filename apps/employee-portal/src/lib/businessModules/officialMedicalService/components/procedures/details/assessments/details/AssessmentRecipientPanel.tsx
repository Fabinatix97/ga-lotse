/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, Stack } from "@mui/joy";

import {
  DetailsItem,
  EditButton,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import { DetailsList, formatPersonName } from "@eshg/lib-portal";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiOmsAssessmentDetails,
  ApiOmsRecipientType,
} from "@eshg/official-medical-service-api";

import { useEditAssessmentRecipientSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/details/EditAssessmentRecipientSidebar";
import {
  formatAddress,
  useIsAssessmentEditable,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/helpers";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function AssessmentRecipientPanel({
  procedure,
  assessment,
}: {
  procedure: ApiEmployeeOmsProcedureDetails;
  assessment: ApiOmsAssessmentDetails;
}) {
  const editAssessmentRecipientSidebar = useEditAssessmentRecipientSidebar();
  const isAssessmentEditable = useIsAssessmentEditable();

  const person =
    assessment.recipientType === ApiOmsRecipientType.Person &&
    procedure.affectedPerson;
  const facility =
    assessment.recipientType === ApiOmsRecipientType.Facility &&
    procedure.facility;

  return (
    <InfoTile
      name="assessmentRecipient"
      title="Ansprechperson"
      controls={
        isAssessmentEditable(assessment) && (
          <EditButton
            aria-label="Ansprechperson bearbeiten"
            onClick={() =>
              editAssessmentRecipientSidebar.open({ procedure, assessment })
            }
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
          {facility && (
            <DetailsItem
              label="Einrichtung"
              value={`${facility.name}\n${formatAddress(facility)}`}
            />
          )}
          {person && (
            <DetailsItem
              label="Person"
              value={`${formatPersonName(person)}\n${formatAddress(person)}`}
            />
          )}
          {!person && !facility && (
            <Chip color="warning">Keine ausgewählt</Chip>
          )}
        </Stack>
      </DetailsList>
    </InfoTile>
  );
}
