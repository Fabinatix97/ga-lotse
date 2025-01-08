/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetProcedure200Response } from "@eshg/employee-portal-api/medicalRegistry";
import {
  employmentStatusNames,
  employmentTypeNames,
  professionalTitleNames,
} from "@eshg/lib-portal/businessModules/medicalRegistry/constants";
import { PERSON_FIELD_NAME } from "@eshg/lib-portal/components/formFields/constants";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Stack } from "@mui/joy";
import { isDefined } from "remeda";

import { ContactData } from "@/lib/businessModules/medicalRegistry/components/procedures/details/ContactData";
import { GENDER_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
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
      <DetailsSection data-testid="professional-section" title="Person">
        <Stack
          direction={{ md: "row" }}
          gap={3}
          divider={<ResponsiveDivider breakpoint="md" />}
        >
          <DetailsColumn>
            <DetailsRow>
              {isDefined(applicant.title) && (
                <DetailsCell
                  label={PROFESSIONAL_FIELD_NAME.title}
                  value={applicant.title}
                />
              )}
              <DetailsCell
                label={PROFESSIONAL_FIELD_NAME.firstName}
                value={applicant.firstName}
              />
              <DetailsCell
                label={PROFESSIONAL_FIELD_NAME.lastName}
                value={applicant.lastName}
              />
            </DetailsRow>
            {isDefined(applicant.nameAtBirth) && (
              <DetailsCell
                label={PROFESSIONAL_FIELD_NAME.nameAtBirth}
                value={applicant.nameAtBirth}
              />
            )}
            <DetailsRow>
              <DetailsCell
                label={PROFESSIONAL_FIELD_NAME.dateOfBirth}
                value={formatDate(applicant.dateOfBirth)}
              />
              {isDefined(applicant.placeOfBirth) && (
                <DetailsCell
                  label={PROFESSIONAL_FIELD_NAME.placeOfBirth}
                  value={applicant.placeOfBirth}
                />
              )}
            </DetailsRow>
            {isDefined(applicant.gender) && (
              <DetailsCell
                label={PROFESSIONAL_FIELD_NAME.gender}
                value={GENDER_VALUES[applicant.gender]}
              />
            )}
            <DetailsCell
              label={PROFESSIONAL_FIELD_NAME.nationality}
              value={translateCountry(applicant.nationality)}
            />
          </DetailsColumn>
          {hasContactData && (
            <DetailsColumn>
              {isDefined(address) && (
                <>
                  <DetailsCell
                    label={PROFESSIONAL_FIELD_NAME.streetAndHouseNumber}
                    value={streetAndHouseNumber(address)}
                  />
                  <DetailsRow>
                    <DetailsCell
                      label={PROFESSIONAL_FIELD_NAME.postalCode}
                      value={address.postalCode}
                    />
                    <DetailsCell
                      label={PROFESSIONAL_FIELD_NAME.city}
                      value={address.city}
                      avoidWrap
                    />
                  </DetailsRow>
                  <DetailsCell
                    label={PROFESSIONAL_FIELD_NAME.country}
                    value={translateCountry(address.country)}
                  />
                </>
              )}
              <ContactData subject={applicant} />
            </DetailsColumn>
          )}
          {isDefined(professionInformation) && (
            <DetailsColumn>
              {(isDefined(professionInformation.professionalTitle) ||
                isDefined(professionInformation.fieldOfExpertise)) && (
                <DetailsRow>
                  <DetailsCell
                    label={PROFESSIONAL_FIELD_NAME.professionalTitle}
                    value={
                      professionInformation.professionalTitle &&
                      professionalTitleNames[
                        professionInformation.professionalTitle
                      ]
                    }
                  />
                  <DetailsCell
                    label={PROFESSIONAL_FIELD_NAME.fieldOfExpertise}
                    value={professionInformation.fieldOfExpertise}
                  />
                </DetailsRow>
              )}
              {(isDefined(professionInformation.specialistTitle) ||
                isDefined(professionInformation.furtherTraining)) && (
                <DetailsRow>
                  <DetailsCell
                    label={PROFESSIONAL_FIELD_NAME.specialistTitle}
                    value={professionInformation.specialistTitle}
                  />
                  <DetailsCell
                    label={PROFESSIONAL_FIELD_NAME.furtherTraining}
                    value={professionInformation.furtherTraining}
                  />
                </DetailsRow>
              )}
              <DetailsCell
                label={PROFESSIONAL_FIELD_NAME.qualifications}
                value={professionInformation.qualifications}
              />
              <DetailsCell
                label={PROFESSIONAL_FIELD_NAME.lifetimeDoctorNumber}
                value={professionInformation.lifetimeDoctorNumber}
              />
              {(isDefined(professionInformation.employmentType) ||
                isDefined(professionInformation.employmentStatus)) && (
                <DetailsRow>
                  <DetailsCell
                    label={PROFESSIONAL_FIELD_NAME.employmentType}
                    value={
                      professionInformation.employmentType &&
                      employmentTypeNames[professionInformation.employmentType]
                    }
                  />
                  <DetailsCell
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
                label={PROFESSIONAL_FIELD_NAME.approbationGrantedOn}
                value={formatDate(professionInformation.approbationGrantedOn)}
              />
              <DetailsCell
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
