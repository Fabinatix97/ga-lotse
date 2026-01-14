/**
 * Copyright 2026 cronn GmbH
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
import {
  DetailsColumn,
  DetailsList,
  OPTIONAL_FALLBACK_VALUE,
  formatDate,
  formatOptionalKey,
} from "@eshg/lib-portal";
import { ApiProcedureDetails } from "@eshg/prostitute-protection-api";

import { useDecryptedPersons } from "../../../contexts/decryptedPersons/DecryptedPersonsStoreProvider";
import {
  DOCUMENT_TYPE_VALUES,
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
  const { getDecryptedPerson } = useDecryptedPersons();
  const personData = getDecryptedPerson(procedure.id);

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
                value={personData?.firstName ?? OPTIONAL_FALLBACK_VALUE}
              />
              <DetailsItem
                label={PERSON_FIELD_NAME.lastName}
                value={personData?.lastName ?? OPTIONAL_FALLBACK_VALUE}
              />
              <DetailsItem
                label={PERSON_FIELD_NAME.alias}
                value={procedure.alias ?? OPTIONAL_FALLBACK_VALUE}
              />
              <DetailsItem
                label={PERSON_FIELD_NAME.dateOfBirth}
                value={
                  isNullish(personData?.dateOfBirth)
                    ? OPTIONAL_FALLBACK_VALUE
                    : formatDate(personData.dateOfBirth)
                }
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
              <DetailsItem
                label={PERSON_FIELD_NAME.documentType}
                value={formatOptionalKey(
                  procedure.documentTypeDto,
                  DOCUMENT_TYPE_VALUES,
                )}
              />
            </DetailsColumn>
          </Stack>
        </DetailsList>
      </DetailsSection>
    </ContentPanel>
  );
}
