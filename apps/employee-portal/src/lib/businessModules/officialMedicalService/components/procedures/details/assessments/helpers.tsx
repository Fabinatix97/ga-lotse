/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { isPostboxAddress, useGetSelfUser } from "@eshg/lib-employee-portal";
import {
  formatPersonName,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
} from "@eshg/lib-portal";
import {
  ApiAffectedPersonContactAddress,
  type ApiEmployeeOmsProcedureDetails,
  ApiOmsAssessment,
  ApiOmsAssessmentResult,
  ApiOmsAssessmentStatus,
  ApiOmsRecipientType,
  ApiOmsUser,
} from "@eshg/official-medical-service-api";

import { NAMES_ASSESSMENT_RESULT } from "@/lib/businessModules/officialMedicalService/shared/translations";

export function useIsAssessmentOwner() {
  const { data: selfUser } = useGetSelfUser();
  return (assessment: ApiOmsAssessment) =>
    assessment.editor.id === selfUser.userId;
}

export function useIsAssessmentEditable() {
  const isAssessmentOwner = useIsAssessmentOwner();
  return (assessment: ApiOmsAssessment) =>
    assessment.assessmentStatus === ApiOmsAssessmentStatus.Open &&
    isAssessmentOwner(assessment);
}

export function formatAddress({
  contactAddress: address,
}: {
  contactAddress?: ApiAffectedPersonContactAddress;
}): string {
  if (!address) return "";
  return `${isPostboxAddress(address) ? `Postfach ${address.postbox}` : formatStreetAndHouseNumber(address)}, ${formatPostalCodeAndCity(address)}`;
}

export function buildRecipientOptions(
  procedure: ApiEmployeeOmsProcedureDetails,
) {
  return {
    Personen: [
      {
        id: ApiOmsRecipientType.Person,
        name: (
          <Stack>
            <Typography>
              {formatPersonName(procedure.affectedPerson)}&nbsp;
            </Typography>
            <Typography level="body-sm" textColor="text.secondary">
              {formatAddress(procedure.affectedPerson)}
            </Typography>
          </Stack>
        ),
      },
    ],
    Einrichtungen: procedure.facility
      ? [
          {
            id: ApiOmsRecipientType.Facility,
            name: (
              <Stack>
                <Typography>{procedure.facility.name}&nbsp;</Typography>
                <Typography level="body-sm" textColor="text.secondary">
                  {formatAddress(procedure.facility)}
                </Typography>
              </Stack>
            ),
          },
        ]
      : [],
  };
}

export function formatUser(user: ApiOmsUser): string {
  return user.name ?? `Unbekannter Nutzer (${user.id})`;
}

export function formatAssessmentResult(
  assessmentResult?: ApiOmsAssessmentResult,
): string {
  return assessmentResult
    ? NAMES_ASSESSMENT_RESULT[assessmentResult]
    : "Keine Auswahl";
}
