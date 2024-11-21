/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetProcedure200Response } from "@eshg/employee-portal-api/medicalRegistry";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import {
  employmentStatusNames,
  employmentTypeNames,
  professionalTitleNames,
} from "@/lib/businessModules/medicalRegistry/shared/constants";
import { GENDER_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { ExternalLinkDetailsCell } from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { PERSON_FIELD_NAME } from "@/lib/shared/components/personSidebar/constants";
import { streetAndHouseNumber } from "@/lib/shared/helpers/facilityUtils";
import { translateCountry } from "@/lib/shared/helpers/i18n";

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100% / 3 - 2 * ${theme.spacing(2)})` }),
};

const PROFESSIONAL_FIELD_NAME = {
  ...PERSON_FIELD_NAME,
  nationality: "Staatsangehörigkeit",
  professionalTitle: "Berufsbezeichnung",
  fieldOfExpertise: "Fachgebiet",
  specialistTitle: "Facharztbezeichnung",
  furtherTraining: "Weiterbildung",
  qualifications: "Qualifizierung",
  lifetimeDoctorNumber: "Lebenslange Arztnummer (LAN)",
  employmentType: "Beschäftigungsart",
  employmentStatus: "Beschäftigungsstatus",
  approbationGrantedOn: "Erlaubnis/Approbation erteilt am",
  approbationIssuingAuthority: "Ausstellungsbehörde",
  postalCode: "Postleitzahl",
  streetAndHouseNumber: "Straße und Haus Nr.",
  city: "Ort",
  country: "Land",
};

const fieldName = createFieldNameMapper<typeof PROFESSIONAL_FIELD_NAME>();

export function ProfessionalDetailsSection({
  procedure,
}: Readonly<{ procedure: ApiGetProcedure200Response }>) {
  const { professional } = procedure;
  const { address, emailAddresses, phoneNumbers } = professional;

  const hasContactData =
    isDefined(address) || emailAddresses.length > 0 || phoneNumbers.length > 0;

  return (
    <InformationSheet>
      <DetailsSection name="professional-section" title="Person">
        <Stack
          direction={{ md: "row" }}
          gap={3}
          divider={<ResponsiveDivider breakpoint="md" />}
        >
          <DetailsColumn sx={COLUMN_STYLE}>
            <DetailsRow>
              {isDefined(professional.title) && (
                <DetailsCell
                  name={fieldName("title")}
                  label={PROFESSIONAL_FIELD_NAME.title}
                  value={professional.title}
                />
              )}
              <DetailsCell
                name={fieldName("firstName")}
                label={PROFESSIONAL_FIELD_NAME.firstName}
                value={professional.firstName}
              />
              <DetailsCell
                name={fieldName("lastName")}
                label={PROFESSIONAL_FIELD_NAME.lastName}
                value={professional.lastName}
              />
            </DetailsRow>
            {isDefined(professional.nameAtBirth) && (
              <DetailsCell
                name={fieldName("nameAtBirth")}
                label={PROFESSIONAL_FIELD_NAME.nameAtBirth}
                value={professional.nameAtBirth}
              />
            )}
            <DetailsRow>
              <DetailsCell
                name={fieldName("dateOfBirth")}
                label={PROFESSIONAL_FIELD_NAME.dateOfBirth}
                value={formatDate(professional.dateOfBirth)}
              />
              {isDefined(professional.placeOfBirth) && (
                <DetailsCell
                  name={fieldName("placeOfBirth")}
                  label={PROFESSIONAL_FIELD_NAME.placeOfBirth}
                  value={professional.placeOfBirth}
                />
              )}
            </DetailsRow>
            {isDefined(professional.gender) && (
              <DetailsCell
                name={fieldName("gender")}
                label={PROFESSIONAL_FIELD_NAME.gender}
                value={GENDER_VALUES[professional.gender]}
              />
            )}
            <DetailsCell
              name={fieldName("nationality")}
              label={PROFESSIONAL_FIELD_NAME.nationality}
              value={translateCountry(professional.nationality)}
            />
          </DetailsColumn>
          {hasContactData && (
            <DetailsColumn sx={COLUMN_STYLE}>
              {isDefined(address) && (
                <>
                  <DetailsCell
                    name={fieldName("streetAndHouseNumber")}
                    label={PROFESSIONAL_FIELD_NAME.streetAndHouseNumber}
                    value={streetAndHouseNumber(address)}
                  />
                  <DetailsRow>
                    <DetailsCell
                      name={fieldName("postalCode")}
                      label={PROFESSIONAL_FIELD_NAME.postalCode}
                      value={address.postalCode}
                    />
                    <DetailsCell
                      name={fieldName("city")}
                      label={PROFESSIONAL_FIELD_NAME.city}
                      value={address.city}
                      avoidWrap
                    />
                  </DetailsRow>
                  <DetailsCell
                    name={fieldName("country")}
                    label={PROFESSIONAL_FIELD_NAME.country}
                    value={translateCountry(address.country)}
                  />
                </>
              )}
              {emailAddresses.map((emailAddress) => (
                <ExternalLinkDetailsCell
                  key={emailAddress}
                  name={fieldName("emailAddresses")}
                  label={PROFESSIONAL_FIELD_NAME.emailAddresses}
                  value={emailAddress}
                  href={(value) => `mailto:${value}`}
                />
              ))}
              {phoneNumbers.map((phoneNumber) => (
                <DetailsCell
                  key={phoneNumber}
                  name={fieldName("phoneNumbers")}
                  label={PROFESSIONAL_FIELD_NAME.phoneNumbers}
                  value={phoneNumber}
                />
              ))}
            </DetailsColumn>
          )}
          <DetailsColumn sx={COLUMN_STYLE}>
            <DetailsRow>
              <DetailsCell
                name={fieldName("professionalTitle")}
                label={PROFESSIONAL_FIELD_NAME.professionalTitle}
                value={professionalTitleNames[professional.professionalTitle]}
              />
              <DetailsCell
                name={fieldName("fieldOfExpertise")}
                label={PROFESSIONAL_FIELD_NAME.fieldOfExpertise}
                value={professional.fieldOfExpertise}
              />
            </DetailsRow>
            {(isDefined(professional.specialistTitle) ||
              isDefined(professional.furtherTraining)) && (
              <DetailsRow>
                <DetailsCell
                  name={fieldName("specialistTitle")}
                  label={PROFESSIONAL_FIELD_NAME.specialistTitle}
                  value={professional.specialistTitle}
                />
                <DetailsCell
                  name={fieldName("furtherTraining")}
                  label={PROFESSIONAL_FIELD_NAME.furtherTraining}
                  value={professional.furtherTraining}
                />
              </DetailsRow>
            )}
            <DetailsCell
              name={fieldName("qualifications")}
              label={PROFESSIONAL_FIELD_NAME.qualifications}
              value={professional.qualifications}
            />
            <DetailsCell
              name={fieldName("lifetimeDoctorNumber")}
              label={PROFESSIONAL_FIELD_NAME.lifetimeDoctorNumber}
              value={professional.lifetimeDoctorNumber}
            />
            <DetailsRow>
              <DetailsCell
                name={fieldName("employmentType")}
                label={PROFESSIONAL_FIELD_NAME.employmentType}
                value={employmentTypeNames[professional.employmentType]}
              />
              <DetailsCell
                name={fieldName("employmentStatus")}
                label={PROFESSIONAL_FIELD_NAME.employmentStatus}
                value={employmentStatusNames[professional.employmentStatus]}
              />
            </DetailsRow>
            <DetailsCell
              name={fieldName("approbationGrantedOn")}
              label={PROFESSIONAL_FIELD_NAME.approbationGrantedOn}
              value={formatDate(professional.approbationGrantedOn)}
            />
            <DetailsCell
              name={fieldName("approbationIssuingAuthority")}
              label={PROFESSIONAL_FIELD_NAME.approbationIssuingAuthority}
              value={professional.approbationIssuingAuthority}
            />
          </DetailsColumn>
        </Stack>
      </DetailsSection>
    </InformationSheet>
  );
}
