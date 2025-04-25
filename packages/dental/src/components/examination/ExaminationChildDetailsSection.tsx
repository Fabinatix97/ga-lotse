/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
} from "@mui/joy";

import { ApiFluoridationConsent } from "@eshg/dental-api";
import { DetailsItem, InformationSheet } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";

import { FluoridationConsentInformationSection } from "@/components/fluoridationConsent/FluoridationConsentInformationSection";

interface ExaminationChildDetailsSectionProps {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  dateOfExamination: Date;
  groupName: string;
  allFluoridationConsents: ApiFluoridationConsent[];
}

export function ExaminationChildDetailsSection(
  props: ExaminationChildDetailsSectionProps,
) {
  return (
    <InformationSheet>
      <Accordion>
        <AccordionSummary
          sx={{
            fontWeight: 600,
            "--variant-plainHoverBg": "transparent",
            "--variant-plainActiveBg": "transparent",
          }}
        >
          Details zum Kind
        </AccordionSummary>
        <AccordionDetails
          slotProps={{
            content: {
              sx: { paddingTop: 3, paddingBottom: 1, gap: 1 },
            },
          }}
        >
          <Stack direction="row" gap={3} flexWrap="wrap">
            <DetailsItem
              label="Name"
              value={formatPersonName({
                firstName: props.firstName,
                lastName: props.lastName,
              })}
            />
            <DetailsItem
              label="Geburtstag"
              value={formatDate(props.dateOfBirth)}
            />
          </Stack>
          <DetailsItem label="Gruppe" value={props.groupName} />
          <DetailsItem
            label="Alter bei Untersuchung"
            value={`${calculateAge(props.dateOfBirth, props.dateOfExamination)} Jahre`}
          />
          <Divider orientation="horizontal" />
          <FluoridationConsentInformationSection
            allFluoridationConsents={props.allFluoridationConsents}
          />
        </AccordionDetails>
      </Accordion>
    </InformationSheet>
  );
}
