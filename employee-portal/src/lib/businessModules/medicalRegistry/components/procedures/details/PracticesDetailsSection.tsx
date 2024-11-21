/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetProcedure200Response,
  ApiPractice,
} from "@eshg/employee-portal-api/medicalRegistry";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { ExternalLinkDetailsCell } from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { streetAndHouseNumber } from "@/lib/shared/helpers/facilityUtils";

export function PracticesDetailsSection({
  procedure,
}: Readonly<{ procedure: ApiGetProcedure200Response }>) {
  const { practices } = procedure;
  if (!isDefined(practices)) {
    return null;
  }

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
  emailAddress: "E-Mail-Adresse",
  phoneNumber: "Telefonnummer",
  website: "Website",
  openingHours: "Öffnungszeiten",
  institutionIdentifier: "Institutionskennzeichen (IK)",
  establishmentNumber: "Betriebsstättennummer (BSNR)",
  healthInsuranceAuthorization: "Kassenzulassung",
};

const fieldName = createFieldNameMapper<typeof PRACTICE_FIELD_NAME>();

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100% / 3 - 2 * ${theme.spacing(2)})` }),
};

function PracticeDetails({
  practiceNumber,
  practice,
}: Readonly<{ practiceNumber?: number; practice: ApiPractice }>) {
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
      <DetailsSection name="practice-section" title={title}>
        <Stack
          direction={{ md: "row" }}
          gap={3}
          divider={<ResponsiveDivider breakpoint="md" />}
        >
          <DetailsColumn sx={COLUMN_STYLE}>
            <DetailsCell
              name={fieldName("name")}
              label={"Name"}
              value={practice.name}
            />
            {isDefined(address) && (
              <>
                <DetailsCell
                  name={fieldName("streetAndHouseNumber")}
                  label={PRACTICE_FIELD_NAME.streetAndHouseNumber}
                  value={streetAndHouseNumber(address)}
                />
                <DetailsRow>
                  <DetailsCell
                    name={fieldName("postalCode")}
                    label={PRACTICE_FIELD_NAME.postalCode}
                    value={address.postalCode}
                  />
                  <DetailsCell
                    name={fieldName("city")}
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
                name={fieldName("openingHours")}
                label={PRACTICE_FIELD_NAME.openingHours}
                value={practice.openingHours}
              />
              {emailAddresses.map((emailAddress) => (
                <ExternalLinkDetailsCell
                  key={emailAddress}
                  name={fieldName("emailAddress")}
                  label={PRACTICE_FIELD_NAME.emailAddress}
                  value={emailAddress}
                  href={(value) => `mailto:${value}`}
                />
              ))}
              {phoneNumbers.map((phoneNumber) => (
                <DetailsCell
                  key={phoneNumber}
                  name={fieldName("phoneNumber")}
                  label={PRACTICE_FIELD_NAME.phoneNumber}
                  value={phoneNumber}
                />
              ))}
              <DetailsCell
                name={fieldName("website")}
                label={PRACTICE_FIELD_NAME.website}
                value={practice.website}
              />
            </DetailsColumn>
          )}
          <DetailsColumn sx={COLUMN_STYLE}>
            <DetailsCell
              name={fieldName("institutionIdentifier")}
              label={PRACTICE_FIELD_NAME.institutionIdentifier}
              value={practice.institutionIdentifier}
            />
            <DetailsCell
              name={fieldName("establishmentNumber")}
              label={PRACTICE_FIELD_NAME.establishmentNumber}
              value={practice.establishmentNumber}
            />
            <DetailsCell
              name={fieldName("healthInsuranceAuthorization")}
              label={PRACTICE_FIELD_NAME.healthInsuranceAuthorization}
              value={practice.healthInsuranceAuthorization ? "Ja" : "Nein"}
            />
          </DetailsColumn>
        </Stack>
      </DetailsSection>
    </InformationSheet>
  );
}
