/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { isDefined } from "remeda";

import {
  DetailsItem,
  DetailsRow,
  DetailsSection,
  InformationSheet,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import {
  DetailsColumn,
  DetailsList,
  GENDER_VALUES,
  PERSON_FIELD_NAME,
  formatDate,
  formatStreetAndHouseNumber,
  translateCountry,
} from "@eshg/lib-portal";
import {
  EMPLOYMENT_STATUS_NAMES,
  EMPLOYMENT_TYPE_NAMES,
  PROFESSIONAL_TITLE_NAMES,
} from "@eshg/medical-registry";
import { ApiGetProcedure200Response } from "@eshg/medical-registry-api";

import { ContactData } from "@/lib/businessModules/medicalRegistry/components/procedures/details/ContactData";

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
        <DetailsList>
          <Stack
            direction={{ md: "row" }}
            gap={3}
            divider={<ResponsiveDivider breakpoint="md" />}
          >
            <DetailsColumn>
              <DetailsRow>
                {isDefined(applicant.title) && (
                  <DetailsItem
                    label={PROFESSIONAL_FIELD_NAME.title}
                    value={applicant.title}
                  />
                )}
                <DetailsItem
                  label={PROFESSIONAL_FIELD_NAME.firstName}
                  value={applicant.firstName}
                />
                <DetailsItem
                  label={PROFESSIONAL_FIELD_NAME.lastName}
                  value={applicant.lastName}
                />
              </DetailsRow>
              {isDefined(applicant.nameAtBirth) && (
                <DetailsItem
                  label={PROFESSIONAL_FIELD_NAME.nameAtBirth}
                  value={applicant.nameAtBirth}
                />
              )}
              <DetailsRow>
                <DetailsItem
                  label={PROFESSIONAL_FIELD_NAME.dateOfBirth}
                  value={formatDate(applicant.dateOfBirth)}
                />
                {isDefined(applicant.placeOfBirth) && (
                  <DetailsItem
                    label={PROFESSIONAL_FIELD_NAME.placeOfBirth}
                    value={applicant.placeOfBirth}
                  />
                )}
              </DetailsRow>
              {isDefined(applicant.gender) && (
                <DetailsItem
                  label={PROFESSIONAL_FIELD_NAME.gender}
                  value={GENDER_VALUES[applicant.gender]}
                />
              )}
              <DetailsItem
                label={PROFESSIONAL_FIELD_NAME.nationality}
                value={translateCountry(applicant.nationality)}
              />
            </DetailsColumn>
            {hasContactData && (
              <DetailsColumn>
                {isDefined(address) && (
                  <>
                    <DetailsItem
                      label={PROFESSIONAL_FIELD_NAME.streetAndHouseNumber}
                      value={formatStreetAndHouseNumber(address)}
                    />
                    <DetailsRow>
                      <DetailsItem
                        label={PROFESSIONAL_FIELD_NAME.postalCode}
                        value={address.postalCode}
                      />
                      <DetailsItem
                        label={PROFESSIONAL_FIELD_NAME.city}
                        value={address.city}
                        avoidWrap
                      />
                    </DetailsRow>
                    <DetailsItem
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
                    <DetailsItem
                      label={PROFESSIONAL_FIELD_NAME.professionalTitle}
                      value={
                        professionInformation.professionalTitle &&
                        PROFESSIONAL_TITLE_NAMES[
                          professionInformation.professionalTitle
                        ]
                      }
                    />
                    <DetailsItem
                      label={PROFESSIONAL_FIELD_NAME.fieldOfExpertise}
                      value={professionInformation.fieldOfExpertise}
                    />
                  </DetailsRow>
                )}
                {(isDefined(professionInformation.specialistTitle) ||
                  isDefined(professionInformation.furtherTraining)) && (
                  <DetailsRow>
                    <DetailsItem
                      label={PROFESSIONAL_FIELD_NAME.specialistTitle}
                      value={professionInformation.specialistTitle}
                    />
                    <DetailsItem
                      label={PROFESSIONAL_FIELD_NAME.furtherTraining}
                      value={professionInformation.furtherTraining}
                    />
                  </DetailsRow>
                )}
                <DetailsItem
                  label={PROFESSIONAL_FIELD_NAME.qualifications}
                  value={professionInformation.qualifications}
                />
                <DetailsItem
                  label={PROFESSIONAL_FIELD_NAME.lifetimeDoctorNumber}
                  value={professionInformation.lifetimeDoctorNumber}
                />
                {(isDefined(professionInformation.employmentType) ||
                  isDefined(professionInformation.employmentStatus)) && (
                  <DetailsRow>
                    <DetailsItem
                      label={PROFESSIONAL_FIELD_NAME.employmentType}
                      value={
                        professionInformation.employmentType &&
                        EMPLOYMENT_TYPE_NAMES[
                          professionInformation.employmentType
                        ]
                      }
                    />
                    <DetailsItem
                      label={PROFESSIONAL_FIELD_NAME.employmentStatus}
                      value={
                        professionInformation.employmentStatus &&
                        EMPLOYMENT_STATUS_NAMES[
                          professionInformation.employmentStatus
                        ]
                      }
                    />
                  </DetailsRow>
                )}
                <DetailsItem
                  label={PROFESSIONAL_FIELD_NAME.approbationGrantedOn}
                  value={formatDate(professionInformation.approbationGrantedOn)}
                />
                <DetailsItem
                  label={PROFESSIONAL_FIELD_NAME.approbationIssuingAuthority}
                  value={professionInformation.approbationIssuingAuthority}
                />
              </DetailsColumn>
            )}
          </Stack>
        </DetailsList>
      </DetailsSection>
    </InformationSheet>
  );
}
