/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetProcedure200Response,
  ApiPractice,
} from "@eshg/employee-portal-api/medicalRegistry";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import { ContactData } from "@/lib/businessModules/medicalRegistry/components/procedures/details/ContactData";
import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
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
            <DetailsCell label={"Name"} value={practice.name} />
            {isDefined(address) && (
              <>
                <DetailsCell
                  label={PRACTICE_FIELD_NAME.streetAndHouseNumber}
                  value={streetAndHouseNumber(address)}
                />
                <DetailsRow>
                  <DetailsCell
                    label={PRACTICE_FIELD_NAME.postalCode}
                    value={address.postalCode}
                  />
                  <DetailsCell
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
              <DetailsCell
                label={PRACTICE_FIELD_NAME.openingHours}
                value={practice.openingHours}
              />
              <ContactData subject={practice} />
              <DetailsCell
                label={PRACTICE_FIELD_NAME.website}
                value={practice.website}
              />
            </DetailsColumn>
          )}
          <DetailsColumn sx={COLUMN_STYLE}>
            <DetailsCell
              label={PRACTICE_FIELD_NAME.institutionIdentifier}
              value={practice.institutionIdentifier}
            />
            <DetailsCell
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
