/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetProcedure200Response } from "@eshg/employee-portal-api/medicalRegistry";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";
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
}: Readonly<{
  procedure: ApiGetProcedure200Response;
}>) {
  const { applicant, professionInformation } = procedure;
  const { address, emailAddresses, phoneNumbers } = applicant;

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
          <DetailsColumn>
            <DetailsRow>
              {isDefined(applicant.title) && (
                <DetailsCell
                  name={fieldName("title")}
                  label={PROFESSIONAL_FIELD_NAME.title}
                  value={applicant.title}
                />
              )}
              <DetailsCell
                name={fieldName("firstName")}
                label={PROFESSIONAL_FIELD_NAME.firstName}
                value={applicant.firstName}
              />
              <DetailsCell
                name={fieldName("lastName")}
                label={PROFESSIONAL_FIELD_NAME.lastName}
                value={applicant.lastName}
              />
            </DetailsRow>
            {isDefined(applicant.nameAtBirth) && (
              <DetailsCell
                name={fieldName("nameAtBirth")}
                label={PROFESSIONAL_FIELD_NAME.nameAtBirth}
                value={applicant.nameAtBirth}
              />
            )}
            <DetailsRow>
              <DetailsCell
                name={fieldName("dateOfBirth")}
                label={PROFESSIONAL_FIELD_NAME.dateOfBirth}
                value={formatDate(applicant.dateOfBirth)}
              />
              {isDefined(applicant.placeOfBirth) && (
                <DetailsCell
                  name={fieldName("placeOfBirth")}
                  label={PROFESSIONAL_FIELD_NAME.placeOfBirth}
                  value={applicant.placeOfBirth}
                />
              )}
            </DetailsRow>
            {isDefined(applicant.gender) && (
              <DetailsCell
                name={fieldName("gender")}
                label={PROFESSIONAL_FIELD_NAME.gender}
                value={GENDER_VALUES[applicant.gender]}
              />
            )}
            <DetailsCell
              name={fieldName("nationality")}
              label={PROFESSIONAL_FIELD_NAME.nationality}
              value={translateCountry(applicant.nationality)}
            />
          </DetailsColumn>
          {hasContactData && (
            <DetailsColumn>
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
          {isDefined(professionInformation) && (
            <DetailsColumn>
              {(isDefined(professionInformation.professionalTitle) ||
                isDefined(professionInformation.fieldOfExpertise)) && (
                <DetailsRow>
                  <DetailsCell
                    name={fieldName("professionalTitle")}
                    label={PROFESSIONAL_FIELD_NAME.professionalTitle}
                    value={
                      professionInformation.professionalTitle &&
                      professionalTitleNames[
                        professionInformation.professionalTitle
                      ]
                    }
                  />
                  <DetailsCell
                    name={fieldName("fieldOfExpertise")}
                    label={PROFESSIONAL_FIELD_NAME.fieldOfExpertise}
                    value={professionInformation.fieldOfExpertise}
                  />
                </DetailsRow>
              )}
              {(isDefined(professionInformation.specialistTitle) ||
                isDefined(professionInformation.furtherTraining)) && (
                <DetailsRow>
                  <DetailsCell
                    name={fieldName("specialistTitle")}
                    label={PROFESSIONAL_FIELD_NAME.specialistTitle}
                    value={professionInformation.specialistTitle}
                  />
                  <DetailsCell
                    name={fieldName("furtherTraining")}
                    label={PROFESSIONAL_FIELD_NAME.furtherTraining}
                    value={professionInformation.furtherTraining}
                  />
                </DetailsRow>
              )}
              <DetailsCell
                name={fieldName("qualifications")}
                label={PROFESSIONAL_FIELD_NAME.qualifications}
                value={professionInformation.qualifications}
              />
              <DetailsCell
                name={fieldName("lifetimeDoctorNumber")}
                label={PROFESSIONAL_FIELD_NAME.lifetimeDoctorNumber}
                value={professionInformation.lifetimeDoctorNumber}
              />
              {(isDefined(professionInformation.employmentType) ||
                isDefined(professionInformation.employmentStatus)) && (
                <DetailsRow>
                  <DetailsCell
                    name={fieldName("employmentType")}
                    label={PROFESSIONAL_FIELD_NAME.employmentType}
                    value={
                      professionInformation.employmentType &&
                      employmentTypeNames[professionInformation.employmentType]
                    }
                  />
                  <DetailsCell
                    name={fieldName("employmentStatus")}
                    label={PROFESSIONAL_FIELD_NAME.employmentStatus}
                    value={
                      professionInformation.employmentStatus &&
                      employmentStatusNames[
                        professionInformation.employmentStatus
                      ]
                    }
                  />
                </DetailsRow>
              )}
              <DetailsCell
                name={fieldName("approbationGrantedOn")}
                label={PROFESSIONAL_FIELD_NAME.approbationGrantedOn}
                value={formatDate(professionInformation.approbationGrantedOn)}
              />
              <DetailsCell
                name={fieldName("approbationIssuingAuthority")}
                label={PROFESSIONAL_FIELD_NAME.approbationIssuingAuthority}
                value={professionInformation.approbationIssuingAuthority}
              />
            </DetailsColumn>
          )}
        </Stack>
      </DetailsSection>
    </InformationSheet>
  );
}
