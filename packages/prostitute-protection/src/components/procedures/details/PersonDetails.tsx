/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack } from "@mui/joy";
import { isDefined } from "remeda";

import {
  DetailsItem,
  DetailsRow,
  DetailsSection,
  EditButton,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import {
  DetailsColumn,
  DetailsList,
  GENDER_VALUES,
  PERSON_FIELD_NAME,
  formatDate,
} from "@eshg/lib-portal";
import { ApiPersonLanguage } from "@eshg/prostitute-protection-api";

// TO DO - Remove this once the prostitute protection module is released
import { ApiProstituteProtectionProcedure } from "../../../mock";
import { LANGUAGE_VALUE } from "../../../shared/constants";
import { isProcedureFinalized } from "../../../shared/helpers";
import { useEditPersonDetailsSidebar } from "../../sidebar/EditPersonDetailsSidebar";

export function PersonDetails({
  procedure,
}: Readonly<{
  procedure: ApiProstituteProtectionProcedure;
}>) {
  const editPersonDetailsSidebar = useEditPersonDetailsSidebar(procedure);
  const person = procedure.person;

  const sortedLanguages = procedure.consultationLanguage
    ? [...procedure.consultationLanguage]
        .sort((a, b) =>
          a === ApiPersonLanguage.German
            ? -1
            : b === ApiPersonLanguage.German
              ? 1
              : 0,
        )
        .map((lang) => LANGUAGE_VALUE[lang])
    : [];

  return (
    <Sheet>
      <DetailsSection
        title="Antragsteller"
        buttons={
          !isProcedureFinalized(procedure) && (
            <EditButton
              aria-label="Person bearbeiten"
              onClick={() => editPersonDetailsSidebar.open()}
            />
          )
        }
      >
        <DetailsList>
          <Stack
            direction={{ md: "row" }}
            gap={3}
            divider={<ResponsiveDivider breakpoint="md" />}
            width="100%"
          >
            <DetailsColumn>
              {isDefined(person.firstName) && (
                <DetailsItem
                  label={PERSON_FIELD_NAME.firstName}
                  value={person.firstName}
                />
              )}
              <DetailsItem
                label={PERSON_FIELD_NAME.lastName}
                value={person.lastName}
              />
            </DetailsColumn>
            <DetailsColumn>
              {isDefined(procedure.alias.alias) && (
                <DetailsItem label="Alias" value={procedure.alias.alias} />
              )}

              <DetailsRow>
                {isDefined(person.dateOfBirth) && (
                  <DetailsItem
                    label={PERSON_FIELD_NAME.dateOfBirth}
                    value={formatDate(person.dateOfBirth)}
                  />
                )}
                {isDefined(procedure.gender) && (
                  <DetailsItem
                    label={PERSON_FIELD_NAME.gender}
                    value={GENDER_VALUES[procedure.gender]}
                  />
                )}
              </DetailsRow>
            </DetailsColumn>
            <DetailsColumn>
              {isDefined(procedure.consultationLanguage) && (
                <DetailsItem
                  label="Sprachen"
                  value={sortedLanguages.join(", ")}
                />
              )}
            </DetailsColumn>
          </Stack>
        </DetailsList>
      </DetailsSection>
    </Sheet>
  );
}
