/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import {
  DetailsColumn,
  DetailsRow,
  DetailsSection,
  InformationSheet,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import { isNonEmptyString } from "@eshg/lib-portal";
import {
  ApiGetProcedure200Response,
  ApiPractice,
} from "@eshg/medical-registry-api";

import { ContactData } from "@/lib/businessModules/medicalRegistry/components/procedures/details/ContactData";
import {
  DetailsCell,
  DetailsCellWrapped,
} from "@/lib/shared/components/detailsSection/DetailsCell";
import { streetAndHouseNumber } from "@/lib/shared/helpers/facilityUtils";

export function PracticesDetailsSection({
  procedure,
}: Readonly<{
  procedure: ApiGetProcedure200Response;
}>) {
  const { practices } = procedure;

  const hasMultiplePractices = practices.length > 1;
  return practices.map((practice, index) => {
    const practiceNumber = hasMultiplePractices ? index + 1 : undefined;

    return (
      <PracticeDetails
        key={practice.name}
        practiceNumber={practiceNumber}
        practice={practice}
      />
    );
  });
}

const PRACTICE_FIELD_NAME = {
  name: "Name",
  postalCode: "Postleitzahl",
  streetAndHouseNumber: "Straße und Haus Nr.",
  city: "Ort",
  website: "Website",
  openingHours: "Öffnungszeiten",
  institutionIdentifier: "Institutionskennzeichen (IK)",
  establishmentNumber: "Betriebsstättennummer (BSNR)",
  healthInsuranceAuthorization: "Kassenzulassung",
};

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100% / 3 - 2 * ${theme.spacing(2)})` }),
};

function PracticeDetails({
  practiceNumber,
  practice,
}: Readonly<{
  practiceNumber?: number;
  practice: ApiPractice;
}>) {
  const { address, emailAddresses, phoneNumbers } = practice;
  const title = isDefined(practiceNumber)
    ? `Einrichtung ${practiceNumber}`
    : "Einrichtung";

  const hasContactData =
    isNonEmptyString(practice.openingHours) ||
    isNonEmptyString(practice.website) ||
    emailAddresses.length > 0 ||
    phoneNumbers.length > 0;

  return (
    <InformationSheet>
      <DetailsSection data-testid="practice-section" title={title}>
        <Stack
          direction={{ md: "row" }}
          gap={3}
          divider={<ResponsiveDivider breakpoint="md" />}
        >
          <DetailsColumn sx={COLUMN_STYLE}>
            <DetailsCellWrapped label="Name" value={practice.name} />
            {isDefined(address) && (
              <>
                <DetailsCellWrapped
                  label={PRACTICE_FIELD_NAME.streetAndHouseNumber}
                  value={streetAndHouseNumber(address)}
                />
                <DetailsRow>
                  <DetailsCellWrapped
                    label={PRACTICE_FIELD_NAME.postalCode}
                    value={address.postalCode}
                  />
                  <DetailsCellWrapped
                    label={PRACTICE_FIELD_NAME.city}
                    value={address.city}
                    avoidWrap
                  />
                </DetailsRow>
              </>
            )}
          </DetailsColumn>
          {hasContactData && (
            <DetailsColumn sx={COLUMN_STYLE}>
              <DetailsCellWrapped
                label={PRACTICE_FIELD_NAME.openingHours}
                value={practice.openingHours}
              />
              <ContactData subject={practice} />
              <DetailsCellWrapped
                label={PRACTICE_FIELD_NAME.website}
                value={practice.website}
              />
            </DetailsColumn>
          )}
          <DetailsColumn sx={COLUMN_STYLE}>
            <DetailsCellWrapped
              label={PRACTICE_FIELD_NAME.institutionIdentifier}
              value={practice.institutionIdentifier}
            />
            <DetailsCellWrapped
              label={PRACTICE_FIELD_NAME.establishmentNumber}
              value={practice.establishmentNumber}
            />
            <DetailsCell
              label={PRACTICE_FIELD_NAME.healthInsuranceAuthorization}
              value={practice.healthInsuranceAuthorization ? "Ja" : "Nein"}
            />
          </DetailsColumn>
        </Stack>
      </DetailsSection>
    </InformationSheet>
  );
}
