/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFluoridationConsent } from "@eshg/dental-api";
import { DetailsItem } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
} from "@mui/joy";
import { differenceInYears } from "date-fns";

import { FluoridationConsentInformationSection } from "@/lib/businessModules/dental/shared/FluoridationConsentInformationSection";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

interface ChildDetailsSectionProps {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  dateOfExamination: Date;
  groupName: string;
  allFluoridationConsents: ApiFluoridationConsent[];
}

export function ChildDetailsSection(props: ChildDetailsSectionProps) {
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
            value={`${differenceInYears(props.dateOfExamination, props.dateOfBirth)} Jahre`}
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
