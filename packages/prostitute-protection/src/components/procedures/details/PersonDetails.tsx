/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { isNullish } from "remeda";

import {
  ContentPanel,
  DetailsItem,
  DetailsSection,
  EditButton,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import { DetailsColumn, DetailsList, formatDate } from "@eshg/lib-portal";
import { ApiProcedureDetails } from "@eshg/prostitute-protection-api";

import { usePersonDataFromStore } from "../../../contexts/selectedPerson/usePersonDataFromStore";
import {
  DOCUMENT_TYPE_VALUES,
  NATIONALITY_VALUES,
  PERSON_FIELD_NAME,
} from "../../../shared/constants";
import {
  formatLanguages,
  hasSufficientGermanLanguageSkills,
  isProcedureFinalized,
} from "../../../shared/helpers";

import { useEditPersonDetailsSidebar } from "./sidebar/EditPersonDetailsSidebar";

export function PersonDetails({
  procedure,
}: Readonly<{
  procedure: ApiProcedureDetails;
}>) {
  const editPersonDetailsSidebar = useEditPersonDetailsSidebar(procedure);
  const personData = usePersonDataFromStore(procedure);

  return (
    <ContentPanel>
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
              <DetailsItem
                label={PERSON_FIELD_NAME.firstName}
                value={personData.firstName}
              />
              <DetailsItem
                label={PERSON_FIELD_NAME.lastName}
                value={personData.lastName}
              />
              <DetailsItem
                label={PERSON_FIELD_NAME.alias}
                value={procedure.alias}
              />
              <DetailsItem
                label={PERSON_FIELD_NAME.dateOfBirth}
                value={formatDate(personData.dateOfBirth)}
              />
            </DetailsColumn>
            <DetailsColumn>
              <DetailsItem
                label={PERSON_FIELD_NAME.hasSufficientGermanLanguageSkills}
                value={hasSufficientGermanLanguageSkills(procedure.languages)}
              />
              <DetailsItem
                label={PERSON_FIELD_NAME.otherLanguages}
                value={formatLanguages(procedure.languages)}
              />
              {!isNullish(procedure.nationality) && (
                <DetailsItem
                  label={PERSON_FIELD_NAME.nationality}
                  value={NATIONALITY_VALUES[procedure.nationality]}
                />
              )}
              {!isNullish(procedure.documentTypeDto) && (
                <DetailsItem
                  label={PERSON_FIELD_NAME.documentType}
                  value={DOCUMENT_TYPE_VALUES[procedure.documentTypeDto]}
                />
              )}
            </DetailsColumn>
          </Stack>
        </DetailsList>
      </DetailsSection>
    </ContentPanel>
  );
}
